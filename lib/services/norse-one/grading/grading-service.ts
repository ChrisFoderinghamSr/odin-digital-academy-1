// File introduced 2026-08-17 (fe05ed4).
import { prisma } from "@/lib/database/prisma";
import { requirePermission } from "@/lib/auth/authorization";

export async function gradeSubmission(submissionId: string, score: number, feedback: string) {
  const { user } = await requirePermission("GRADE_ASSIGNMENT");
  // Take the course, student and maximum score from the submitted work, never from the form.
  return prisma.$transaction(async tx => {
    const submission = await tx.submission.findFirst({
      where: { id: submissionId, status: "SUBMITTED", assignment: { classroom: { teacher: { userId: user.id } } } },
      include: { assignment: true },
    });
    if (!submission) throw new Error("This submission is unavailable for grading.");
    const { pointsPossible, courseId } = submission.assignment;
    if (!Number.isInteger(score) || score < 0 || score > pointsPossible || pointsPossible < 1) throw new Error("Score is outside the assignment range.");
    const result = await tx.submission.updateMany({
      where: { id: submissionId, status: "SUBMITTED" }, data: { status: "GRADED", score, feedback, gradedAt: new Date() },
    });
    if (!result.count) throw new Error("Another instructor already graded this submission.");
    return tx.gradeRecord.create({ data: { submissionId, studentId: submission.studentId, courseId, score: 100 * score / pointsPossible, feedback, gradedById: user.id } });
  });
}
