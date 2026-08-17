import type { FamilyAccount, ParentGuardian } from "@/types/norse-one";

export const mockFamilies: FamilyAccount[] = [
  {
    id: "family-001",
    familyName: "Foderingham Family",
    parentIds: ["parent-001", "parent-002"],
    studentIds: ["student-001"],
    createdAt: "2026-08-13",
    status: "ACTIVE",
  },
];

export const mockParentGuardians: ParentGuardian[] = [
  {
    id: "guardian-001",
    userId: "usr-parent-001",
    familyId: "family-001",
    relationship: "PARENT",
    primary: true,
    verified: true,
  },
  {
    id: "guardian-002",
    userId: "usr-parent-002",
    familyId: "family-001",
    relationship: "PARENT",
    primary: false,
    verified: true,
  },
];