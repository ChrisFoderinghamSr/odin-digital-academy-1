export type NorseOneRole =
  | "ADMINISTRATOR"
  | "DIRECTOR"
  | "DEVELOPER"
  | "TEACHER"
  | "ASSISTANT"
  | "SUPPORT"
  | "PARENT"
  | "STUDENT";

export type AcademicLevel =
  | "TODDLER"
  | "PRE_K_4"
  | "PRE_K_5"
  | "KINDERGARTEN"
  | "GRADE_1"
  | "GRADE_2"
  | "GRADE_3"
  | "GRADE_4"
  | "GRADE_5";

export type EnrollmentStatus =
  | "APPLICANT"
  | "UNDER_REVIEW"
  | "ACCEPTED"
  | "ENROLLED"
  | "WAITLISTED"
  | "WITHDRAWN";

export type AssignmentStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "GRADED"
  | "RETURNED";

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "EXCUSED"
  | "TARDY";

export interface NorseOneUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: NorseOneRole;
  avatar?: string;
  active: boolean;
}

export interface ParentGuardian {
  id: string;
  userId: string;
  familyId: string;
  relationship: "PARENT" | "GUARDIAN";
  primary: boolean;
  verified: boolean;
}

export interface FamilyAccount {
  id: string;
  familyName: string;
  parentIds: string[];
  studentIds: string[];
  createdAt: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
}

export interface StudentProfile {
  id: string;
  userId: string;
  familyId: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  academicLevel: AcademicLevel;
  enrollmentStatus: EnrollmentStatus;
  enrollmentDate?: string;
  dateOfBirth?: string;
  parentIds: string[];
  currentGpa?: number;
  attendanceRate?: number;
}

export interface Course {
  id: string;
  name: string;
  subject: string;
  academicLevel: AcademicLevel;
  instructorId: string;
  instructorName: string;
  semester: "FALL" | "SPRING";
  progress: number;
  active: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  studentId: string;
  dueDate: string;
  status: AssignmentStatus;
  pointsPossible: number;
  pointsEarned?: number;
  grade?: number;
  submittedAt?: string;
  gradedAt?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  currentGrade: number;
  letterGrade: string;
  instructorId: string;
  instructorName: string;
  semester: "FALL" | "SPRING";
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface StudentProgress {
  studentId: string;
  overallProgress: number;
  academicAverage: number;
  attendanceRate: number;
  assignmentsCompleted: number;
  assignmentsTotal: number;
  coursesCompleted: number;
  coursesTotal: number;
}

export interface NorseOneNavigationItem {
  label: string;
  href: string;
  icon: string;
  roles: NorseOneRole[];
}