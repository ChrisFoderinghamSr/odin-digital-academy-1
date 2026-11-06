// File introduced 2026-08-17 (fe05ed4).
import { requirePermission } from "@/lib/auth/authorization";
import { prisma } from "@/lib/database/prisma";

async function changeEnrollment(id: string, status: "ENROLLED" | "WITHDRAWN") {
  const { user } = await requirePermission("MANAGE_ENROLLMENT");
  return prisma.$transaction(async tx => {
    // Serialize changes to one enrollment so its audit trail stays in the same order.
    await tx.$queryRaw`SELECT id FROM "Enrollment" WHERE id = ${id} FOR UPDATE`;
    const current = await tx.enrollment.findUniqueOrThrow({ where: { id } });
    if (current.status === status) return current;
    const enrollment = await tx.enrollment.update({ where: { id }, data: { status } });
    const active = await tx.enrollment.count({ where: { studentId: current.studentId, status: "ENROLLED" } });
    await tx.studentProfile.update({ where: { id: current.studentId }, data: { enrollmentStatus: active ? "ENROLLED" : status } });
    const last = await tx.enrollmentRevision.aggregate({ where: { enrollmentId: id }, _max: { version: true } });
    await tx.enrollmentRevision.create({ data: { enrollmentId: id, version: (last._max.version ?? 0) + 1,
      snapshot: { previous: current.status, status }, changedById: user.id } });
    return enrollment;
  });
}
export function approveEnrollment(id: string) { return changeEnrollment(id, "ENROLLED"); }
export function withdrawEnrollment(id: string) { return changeEnrollment(id, "WITHDRAWN"); }
