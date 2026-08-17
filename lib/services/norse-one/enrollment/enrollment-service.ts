import { requirePermission } from "@/lib/auth/authorization";

export async function approveEnrollment(
  enrollmentId: string
) {
  await requirePermission(
    "MANAGE_ENROLLMENT"
  );

  if (!enrollmentId) {
    throw new Error(
      "Enrollment ID is required."
    );
  }

  return {
    enrollmentId,
    status: "ENROLLED" as const,
  };
}

export async function withdrawEnrollment(
  enrollmentId: string
) {
  await requirePermission(
    "MANAGE_ENROLLMENT"
  );

  if (!enrollmentId) {
    throw new Error(
      "Enrollment ID is required."
    );
  }

  return {
    enrollmentId,
    status: "WITHDRAWN" as const,
  };
}