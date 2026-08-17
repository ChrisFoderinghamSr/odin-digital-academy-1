import {
  mockFamilies,
  mockParentGuardians,
  mockStudents,
  mockUsers,
} from "@/lib/data/mock";

export function getFamilyById(familyId: string) {
  return mockFamilies.find(
    (family) => family.id === familyId
  );
}

export function getFamilyStudents(familyId: string) {
  const family = getFamilyById(familyId);

  if (!family) {
    return [];
  }

  return mockStudents.filter((student) =>
    family.studentIds.includes(student.id)
  );
}

export function getFamilyParents(familyId: string) {
  const guardians = mockParentGuardians.filter(
    (guardian) => guardian.familyId === familyId
  );

  return guardians
    .map((guardian) => {
      const user = mockUsers.find(
        (item) => item.id === guardian.userId
      );

      return {
        guardian,
        user,
      };
    })
    .filter((item) => item.user);
}