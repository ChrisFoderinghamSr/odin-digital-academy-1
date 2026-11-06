// File introduced 2026-08-17 (fe05ed4).
import { prisma } from "@/lib/database/prisma";
import { requirePermission } from "@/lib/auth/authorization";
import { gradeSubmission } from "../grading/grading-service";

export interface CreateAssignmentInput {
  title: string; instructions: string; pointsPossible: number; dueDate?: Date;
  targetType: "CLASSROOM" | "STUDENT"; courseId: string; classroomId?: string;
  studentIds?: string[]; unitId?: string; lessonId?: string;
}

export async function createAssignment(input: CreateAssignmentInput) {
  const { user } = await requirePermission("CREATE_ASSIGNMENT");
  if (!input.title.trim() || !input.instructions.trim() || !Number.isInteger(input.pointsPossible) || input.pointsPossible < 1) throw new Error("Provide a title, instructions and positive whole points.");
  const classes = await prisma.classroom.findMany({ where: { id: input.classroomId, active: true, courseId: input.courseId, teacher: { userId: user.id } }, include: { students: true } });
  if (!classes.length || (input.targetType === "CLASSROOM" && !input.classroomId)) throw new Error("An assigned classroom is required.");
  const roster = new Set(classes.flatMap(c => c.students.map(s => s.studentId)));
  const recipients = input.targetType === "CLASSROOM" ? [...roster] : [...new Set(input.studentIds)];
  if (!recipients.length || recipients.some(id => !roster.has(id))) throw new Error("Choose students from your classroom.");
  const row = await prisma.assignment.create({ data: { title: input.title.trim(), instructions: input.instructions.trim(),
    courseId: input.courseId, classroomId: input.classroomId ?? classes[0].id, dueDate: input.dueDate,
    unitId: input.unitId, lessonId: input.lessonId, targetType: input.targetType, createdById: user.id,
    pointsPossible: input.pointsPossible, targets: { create: recipients.map(studentId => ({ studentId })) } } });
  return { ...row, created: true };
}

export async function publishAssignment(id: string) {
  const { user } = await requirePermission("PUBLISH_ASSIGNMENT");
  await prisma.assignment.update({ where: { id, createdById: user.id, status: { in: ["DRAFT", "PUBLISHED"] } }, data: { status: "PUBLISHED" } });
  return { assignmentId: id, status: "PUBLISHED" as const };
}

export async function gradeAssignment(assignmentId: string, studentId: string, score: number, feedback = "") {
  await requirePermission("GRADE_ASSIGNMENT");
  const row = await prisma.submission.findUniqueOrThrow({ where: { assignmentId_studentId: { assignmentId, studentId } }, select: { id: true } });
  await gradeSubmission(row.id, score, feedback);
  return { assignmentId, studentId, score, feedback, graded: true };
}
