// File introduced 2026-08-19 (38d23d8).
import { prisma } from "@/lib/database/prisma";

export interface SaveSubmissionInput {
  studentId: string;
  assignmentId: string;
  responseText: string;
  action: "SAVE_DRAFT" | "SUBMIT";
}

export async function getStudentSubmission(
  studentId: string,
  assignmentId: string
) {
  const assignment =
    await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        status: { notIn: ["DRAFT", "ARCHIVED", "CANCELLED"] },

        targets: {
          some: {
            studentId,
          },
        },
      },

      select: {
        id: true,
        title: true,
        instructions: true,
        pointsPossible: true,
        dueDate: true,
        status: true,

        submissions: {
          where: {
            studentId,
          },

          take: 1,

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!assignment) {
    return null;
  }

  return {
    assignment: {
      id: assignment.id,
      title: assignment.title,
      instructions: assignment.instructions,
      pointsPossible:
        assignment.pointsPossible,
      dueDate: assignment.dueDate,
      status: assignment.status,
    },

    submission:
      assignment.submissions[0] ?? null,
  };
}

export async function saveStudentSubmission(
  input: SaveSubmissionInput
) {
  const { assignmentId, studentId, action } = input;
  const responseText = input.responseText.trim();
  if (action === "SUBMIT" && !responseText) throw new Error("A response is required before submitting.");
  return prisma.$transaction(async tx => {
    // Lock the target before checking status. Two browser tabs must not reopen a final submission.
    const targets = await tx.$queryRaw<{ id: string }[]>`
      SELECT t.id FROM "AssignmentTarget" t JOIN "Assignment" a ON a.id = t."assignmentId"
      WHERE t."assignmentId" = ${assignmentId} AND t."studentId" = ${studentId}
        AND a.status NOT IN ('DRAFT', 'ARCHIVED', 'CANCELLED') FOR UPDATE OF t, a
    `;
    if (!targets.length) throw new Error("Assignment is not available to this student.");
    const where = { assignmentId_studentId: { assignmentId, studentId } };
    const existing = await tx.submission.findUnique({ where });
    if (existing && !["NOT_STARTED", "IN_PROGRESS"].includes(existing.status)) {
      if (action === "SUBMIT" && existing.status === "SUBMITTED" && existing.responseText === responseText) return existing;
      throw new Error("A finalized submission cannot be modified.");
    }
    const status = action === "SUBMIT" ? "SUBMITTED" as const : "IN_PROGRESS" as const;
    const data = { status, responseText: responseText || null, submittedAt: action === "SUBMIT" ? new Date() : null };
    return tx.submission.upsert({ where, create: { assignmentId, studentId, ...data }, update: data });
  });
}
