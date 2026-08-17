import { requirePermission } from "@/lib/auth/authorization";

export interface GradeSubmissionInput {
  submissionId: string;
  studentId: string;
  courseId: string;
  score: number;
  pointsPossible: number;
  feedback?: string;
}

export async function gradeSubmission(
  input: GradeSubmissionInput
) {
  await requirePermission("GRADE_ASSIGNMENT");

  if (!input.submissionId) {
    throw new Error(
      "Submission ID is required."
    );
  }

  if (!input.studentId) {
    throw new Error(
      "Student ID is required."
    );
  }

  if (
    input.pointsPossible <= 0 ||
    input.score < 0 ||
    input.score > input.pointsPossible
  ) {
    throw new Error(
      "Invalid grading values."
    );
  }

  const percentage =
    (input.score / input.pointsPossible) * 100;

  return {
    ...input,
    percentage,
    graded: true,
  };
}