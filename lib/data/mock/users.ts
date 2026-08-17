import type { NorseOneUser } from "@/types/norse-one";

export const mockUsers: NorseOneUser[] = [
  {
    id: "usr-parent-001",
    firstName: "Christian",
    lastName: "Foderingham",
    email: "parent@example.com",
    role: "PARENT",
    active: true,
  },
  {
    id: "usr-parent-002",
    firstName: "Heather",
    lastName: "Foderingham",
    email: "parent2@example.com",
    role: "PARENT",
    active: true,
  },
  {
    id: "usr-student-001",
    firstName: "Raven",
    lastName: "Student",
    email: "student@example.com",
    role: "STUDENT",
    active: true,
  },
  {
    id: "usr-teacher-001",
    firstName: "Morgan",
    lastName: "Raven",
    email: "teacher@example.com",
    role: "TEACHER",
    active: true,
  },
  {
    id: "usr-admin-001",
    firstName: "Academy",
    lastName: "Administrator",
    email: "admin@example.com",
    role: "ADMINISTRATOR",
    active: true,
  },
];