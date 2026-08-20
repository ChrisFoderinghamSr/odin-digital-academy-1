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
  const assignment =
    await prisma.assignment.findFirst({
      where: {
        id: input.assignmentId,

        targets: {
          some: {
            studentId: input.studentId,
          },
        },
      },

      select: {
        id: true,
        status: true,
      },
    });

  if (!assignment) {
    throw new Error(
      "Assignment is not available to this student."
    );
  }

  const existingSubmission =
    await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId: input.assignmentId,
          studentId: input.studentId,
        },
      },
    });

  if (
    existingSubmission?.status ===
    "GRADED"
  ) {
    throw new Error(
      "A graded assignment cannot be modified."
    );
  }

  if (
    input.action === "SUBMIT" &&
    !input.responseText.trim()
  ) {
    throw new Error(
      "A response is required before submitting."
    );
  }

  if (
    input.action === "SUBMIT" &&
    existingSubmission?.status ===
      "SUBMITTED"
  ) {
    throw new Error(
      "This assignment has already been submitted."
    );
  }

  const status =
    input.action === "SUBMIT"
      ? "SUBMITTED"
      : "IN_PROGRESS";

  const responseText =
    input.responseText.trim();

  return prisma.submission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId:
          input.assignmentId,
        studentId:
          input.studentId,
      },
    },

    create: {
      assignmentId:
        input.assignmentId,

      studentId:
        input.studentId,

      status,

      responseText:
        responseText || null,

      submittedAt:
        input.action === "SUBMIT"
          ? new Date()
          : null,
    },

    update: {
      status,

      responseText:
        responseText || null,

      ...(input.action === "SUBMIT"
        ? {
            submittedAt: new Date(),
          }
        : {}),
    },
  });
}