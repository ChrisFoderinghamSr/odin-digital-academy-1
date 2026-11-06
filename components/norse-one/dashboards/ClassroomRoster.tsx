import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/database/prisma";
import { requireAuthentication, requirePermission } from "@/lib/auth/authorization";
import { roleHasPermission } from "@/lib/auth/permissions";

async function attendance(form: FormData) {
  "use server";
  const { user } = await requirePermission("CREATE_ATTENDANCE");
  const input = z.object({ member: z.string().min(1), date: z.iso.date(), status: z.enum(["PRESENT","ABSENT","EXCUSED","TARDY"]) }).parse(Object.fromEntries(form));
  const member = await prisma.classroomStudent.findFirstOrThrow({ where: { id: input.member, classroom: { active: true, teacher: { userId: user.id } } } });
  const key = { studentId: member.studentId, classroomId: member.classroomId, date: new Date(input.date + "T00:00:00Z") };
  // Repeated entries for the same class day update a single attendance record.
  await prisma.attendanceRecord.upsert({ where: { studentId_classroomId_date: key }, create: { ...key, status: input.status }, update: { status: input.status } });
  revalidatePath("/norse-one/dashboard");
}

async function send(form: FormData) {
  "use server";
  const { user } = await requirePermission("SEND_MESSAGE");
  const input = z.object({ member: z.string().min(1), id: z.uuid(), subject: z.string().trim().min(1).max(200), body: z.string().trim().min(1).max(5000) }).parse(Object.fromEntries(form));
  const member = await prisma.classroomStudent.findFirstOrThrow({ where: { id: input.member, classroom: { active: true, teacher: { userId: user.id } } }, include: { student: true } });
  await prisma.message.upsert({ where: { id: input.id }, update: {}, create: { id: input.id, senderId: user.id, subject: input.subject, body: input.body,
    recipients: { create: { recipientId: member.student.userId } } } });
  revalidatePath("/norse-one/dashboard");
}

export default async function ClassroomRoster() {
  const { user } = await requireAuthentication();
  const roster = await prisma.classroomStudent.findMany({ where: { classroom: { active: true, teacher: { userId: user.id } } },
    include: { student: true, classroom: true }, orderBy: { student: { lastName: "asc" } } });
  if (!roster.length) return null;
  const options = roster.map(r => <option key={r.id} value={r.id}>{r.classroom.name} · {r.student.firstName} {r.student.lastName}</option>);
  return <section className="norse-message-panel"><h2>Classroom roster</h2>
    {roleHasPermission(user.role, "CREATE_ATTENDANCE") && <form className="academy-form" action={attendance}>
      <label>Student<select name="member">{options}</select></label><label>Class date<input required type="date" name="date"/></label>
      <label>Attendance<select name="status">{["PRESENT","ABSENT","EXCUSED","TARDY"].map(s => <option key={s}>{s}</option>)}</select></label>
      <button className="button">Record attendance</button></form>}
    {roleHasPermission(user.role, "SEND_MESSAGE") && <form className="academy-form" action={send}>
      <label>Message student<select name="member">{options}</select></label><input name="id" type="hidden" value={randomUUID()}/>
      <label>Subject<input required maxLength={200} name="subject"/></label><label>Message<textarea required maxLength={5000} name="body"/></label>
      <button className="button">Send to student inbox</button></form>}
  </section>;
}
