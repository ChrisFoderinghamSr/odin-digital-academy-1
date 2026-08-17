import type {
  Assignment,
  FamilyAccount,
  StudentProfile,
} from "@/types/norse-one";

export function canParentAccessStudent(
  parentUserId: string,
  studentFamilyId: string,
  parentFamilyId: string
): boolean {
  return (
    Boolean(parentUserId) &&
    studentFamilyId === parentFamilyId
  );
}

export function canStudentAccessAssignment(
  studentId: string,
  assignment: Pick<Assignment, "studentId">
): boolean {
  return assignment.studentId === studentId;
}

export function canParentAccessFamily(
  parentFamilyId: string,
  family: Pick<FamilyAccount, "id">
): boolean {
  return parentFamilyId === family.id;
}

export function canStudentAccessProfile(
  studentId: string,
  profile: Pick<StudentProfile, "id">
): boolean {
  return studentId === profile.id;
}