import { requirePermission } from "@/lib/auth/authorization";

export interface CreateAssignmentInput {
  title: string;
  instructions: string;
  pointsPossible: number;
  dueDate?: Date;
  targetType: "CLASSROOM" | "STUDENT";
  courseId: string;
  classroomId?: string;
  studentIds?: string[];
  unitId?: string;
  lessonId?: string;
}

export async function createAssignment(
  input: CreateAssignmentInput
) {
  await requirePermission("CREATE_ASSIGNMENT");

  if (!input.title.trim()) {
    throw new Error(
      "Assignment title is required."
    );
  }

  if (!input.instructions.trim()) {
    throw new Error(
      "Assignment instructions are required."
    );
  }

  if (input.pointsPossible <= 0) {
    throw new Error(
      "Points possible must be greater than zero."
    );
  }

  if (
    input.targetType === "CLASSROOM" &&
    !input.classroomId
  ) {
    throw new Error(
      "A classroom is required for classroom assignments."
    );
  }

  if (
    input.targetType === "STUDENT" &&
    (!input.studentIds ||
      input.studentIds.length === 0)
  ) {
    throw new Error(
      "At least one student is required."
    );
  }

  return {
    ...input,
    status: "DRAFT" as const,
    created: true,
  };
}

export async function publishAssignment(
  assignmentId: string
) {
  await requirePermission("PUBLISH_ASSIGNMENT");

  if (!assignmentId) {
    throw new Error(
      "Assignment ID is required."
    );
  }

  return {
    assignmentId,
    status: "PUBLISHED" as const,
  };
}

export async function gradeAssignment(
  assignmentId: string,
  studentId: string,
  score: number,
  feedback?: string
) {
  await requirePermission("GRADE_ASSIGNMENT");

  if (!assignmentId || !studentId) {
    throw new Error(
      "Assignment and student are required."
    );
  }

  if (score < 0) {
    throw new Error(
      "Score cannot be negative."
    );
  }

  return {
    assignmentId,
    studentId,
    score,
    feedback,
    graded: true,
  };
}