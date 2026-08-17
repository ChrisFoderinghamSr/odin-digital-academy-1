import { requirePermission } from "@/lib/auth/authorization";

export interface CreateClassroomInput {
  name: string;
  gradeLevelId: string;
  courseId: string;
  teacherId: string;
}

export async function createClassroom(
  input: CreateClassroomInput
) {
  await requirePermission("MANAGE_CLASSROOM");

  if (!input.name.trim()) {
    throw new Error("Classroom name is required.");
  }

  if (!input.gradeLevelId) {
    throw new Error("Grade level is required.");
  }

  if (!input.courseId) {
    throw new Error("Course is required.");
  }

  if (!input.teacherId) {
    throw new Error("Teacher is required.");
  }

  return {
    ...input,
    created: true,
  };
}

export async function addStudentToClassroom(
  classroomId: string,
  studentId: string
) {
  await requirePermission("MANAGE_CLASSROOM");

  if (!classroomId || !studentId) {
    throw new Error(
      "Classroom and student are required."
    );
  }

  return {
    classroomId,
    studentId,
    added: true,
  };
}