import type { Assignment } from "@/types/norse-one";

export const mockAssignments: Assignment[] = [
  {
    id: "assignment-001",
    title: "Multiplication Practice",
    description:
      "Complete the multiplication strategy practice set.",
    courseId: "course-math-001",
    courseName: "Mathematics",
    studentId: "student-001",
    dueDate: "2026-08-13",
    status: "IN_PROGRESS",
    pointsPossible: 100,
  },
  {
    id: "assignment-002",
    title: "Reading Response",
    description:
      "Write a response explaining the main character's development.",
    courseId: "course-reading-001",
    courseName: "Reading & Literature",
    studentId: "student-001",
    dueDate: "2026-08-14",
    status: "NOT_STARTED",
    pointsPossible: 100,
  },
  {
    id: "assignment-003",
    title: "Living Systems Project",
    description:
      "Complete the living systems research project.",
    courseId: "course-science-001",
    courseName: "Science",
    studentId: "student-001",
    dueDate: "2026-08-15",
    status: "IN_PROGRESS",
    pointsPossible: 100,
  },
  {
    id: "assignment-004",
    title: "Leadership Reflection",
    description:
      "Complete a reflection on responsibility and leadership.",
    courseId: "course-life-001",
    courseName: "Life Skills",
    studentId: "student-001",
    dueDate: "2026-08-17",
    status: "SUBMITTED",
    pointsPossible: 100,
    pointsEarned: 95,
    grade: 95,
    submittedAt: "2026-08-12",
  },
];