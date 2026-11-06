// File introduced 2026-08-17 (fe05ed4).
import { prisma } from "@/lib/database/prisma";
import type { Assignment } from "@/types/norse-one";

export async function getStudentByUserId(userId: string) {
  const student = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!student) return null;
  return { ...student, currentGpa: student.currentGpa?.toNumber(), attendanceRate: student.attendanceRate?.toNumber() };
}

// Use assignment targets for both screens. A link from the list must open the same
// database record that the submission API will authorize.
export async function getStudentAssignments(studentId: string, id?: string): Promise<Assignment[]> {
  const rows = await prisma.assignment.findMany({
    where: { id, status: { notIn: ["DRAFT", "CANCELLED", "ARCHIVED"] }, targets: { some: { studentId } } },
    include: { course: true, submissions: { where: { studentId } } },
    orderBy: [{ dueDate: "asc" }, { id: "asc" }],
  });
  return rows.map(row => {
    const submission = row.submissions[0];
    return {
      id: row.id, title: row.title, description: row.instructions, studentId,
      courseId: row.courseId, courseName: row.course.name, pointsPossible: row.pointsPossible,
      dueDate: row.dueDate?.toISOString().slice(0, 10) ?? "",
      status: submission?.status ?? "NOT_STARTED", pointsEarned: submission?.score ?? undefined,
      submittedAt: submission?.submittedAt?.toISOString(), gradedAt: submission?.gradedAt?.toISOString(),
    };
  });
}

export async function getStudentAssignmentById(studentId: string, id: string) {
  const [assignment] = await getStudentAssignments(studentId, id);
  return assignment;
}

export async function getStudentCourses(studentId: string) {
  const courses = await prisma.course.findMany({
    where: { active: true, classrooms: { some: { active: true, students: { some: { studentId } } } } },
    include: { subject: true, semester: true, instructor: { include: { user: true } } },
    orderBy: { name: "asc" },
  });
  const assignments = await getStudentAssignments(studentId);
  return courses.map(course => {
    const work = assignments.filter(row => row.courseId === course.id);
    const completed = work.filter(row => ["SUBMITTED", "GRADED", "RETURNED"].includes(row.status));
    const teacher = course.instructor?.user;
    return { id: course.id, name: course.name, subject: course.subject.name, semester: course.semester.semester,
      instructorName: teacher ? [teacher.firstName, teacher.lastName].join(" ") : "Unassigned",
      progress: work.length ? Math.round(100 * completed.length / work.length) : 0 };
  });
}
