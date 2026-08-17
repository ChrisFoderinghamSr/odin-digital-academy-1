import {
  mockAssignments,
  mockAttendance,
  mockCourses,
  mockGrades,
  mockStudents,
} from "@/lib/data/mock";

import type {
  Assignment,
  AttendanceRecord,
  Course,
  GradeRecord,
  StudentProfile,
} from "@/types/norse-one";

export function getStudentById(
  studentId: string
): StudentProfile | undefined {
  return mockStudents.find((student) => student.id === studentId);
}

export function getStudentCourses(
  studentId: string
): Course[] {
  const student = getStudentById(studentId);

  if (!student) {
    return [];
  }

  return mockCourses.filter(
    (course) => course.academicLevel === student.academicLevel
  );
}

export function getStudentAssignments(
  studentId: string
): Assignment[] {
  return mockAssignments.filter(
    (assignment) => assignment.studentId === studentId
  );
}

export function getStudentGrades(
  studentId: string
): GradeRecord[] {
  return mockGrades.filter(
    (grade) => grade.studentId === studentId
  );
}

export function getStudentAttendance(
  studentId: string
): AttendanceRecord[] {
  return mockAttendance.filter(
    (record) => record.studentId === studentId
  );
}