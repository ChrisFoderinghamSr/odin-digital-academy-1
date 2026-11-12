import { prisma } from "@/lib/database/prisma";
import type { AssignmentStatus } from "@/types/norse-one";

export function getStudentByUserId(userId: string) {
  return prisma.studentProfile.findUnique({ where: { userId } });
}

export async function getStudentAssignments(studentId: string, assignmentId?: string) {
  const assignments = await prisma.assignment.findMany({
    where: { id: assignmentId, status: { notIn: ["DRAFT", "ARCHIVED"] }, targets: { some: { studentId } } },
    include: { course: true, submissions: { where: { studentId } } },
    orderBy: [{ dueDate: "asc" }, { id: "asc" }],
  });
  return assignments.map(row => {
    const submission = row.submissions[0];
    return {
      id: row.id, courseId: row.courseId, courseName: row.course.name,
      title: row.title, description: row.instructions, pointsPossible: row.pointsPossible,
      pointsEarned: submission?.score ?? undefined, submittedAt: submission?.submittedAt?.toISOString(),
      dueDate: row.dueDate?.toISOString().slice(0, 10) ?? "",
      status: (submission?.status ?? "NOT_STARTED") as AssignmentStatus,
    };
  });
}

export async function getStudentCourses(studentId: string, assignments: Awaited<ReturnType<typeof getStudentAssignments>>) {
  const courses = await prisma.course.findMany({
    where: { active: true, classrooms: { some: { active: true, students: { some: { studentId } } } } },
    include: { subject: true, instructor: { include: { user: true } } }, orderBy: { name: "asc" },
  });
  return courses.map(course => {
    const work = assignments.filter(item => item.courseId === course.id);
    const done = work.filter(item => ["SUBMITTED","GRADED","RETURNED"].includes(item.status));
    return { id: course.id, name: course.name, subject: course.subject.name,
      instructorName: course.instructor ? [course.instructor.user.firstName,course.instructor.user.lastName].join(" ") : "Unassigned",
      progress: work.length ? Math.round(100 * done.length / work.length) : 0 };
  });
}
