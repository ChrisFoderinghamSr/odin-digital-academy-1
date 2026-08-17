import type { StudentProfile } from "@/types/norse-one";

export const mockStudents: StudentProfile[] = [
  {
    id: "student-001",
    userId: "usr-student-001",
    familyId: "family-001",
    firstName: "Raven",
    lastName: "Student",
    studentNumber: "ODA-2026-0001",
    academicLevel: "GRADE_5",
    enrollmentStatus: "ENROLLED",
    enrollmentDate: "2026-08-17",
    parentIds: ["parent-001", "parent-002"],
    currentGpa: 3.8,
    attendanceRate: 97,
  },
];