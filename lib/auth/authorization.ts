import { auth } from "@/auth";
import type { NorseOneRole } from "@/types/norse-one";
import {
  roleHasPermission,
  type NorseOnePermission,
} from "./permissions";

export class AuthorizationError extends Error {
  statusCode: number;

  constructor(
    message = "You are not authorized to perform this action."
  ) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 403;
  }
}

export async function requireAuthentication() {
  const session = await auth();

  if (!session?.user) {
    throw new AuthorizationError(
      "Authentication is required."
    );
  }

  return session;
}

export async function requirePermission(
  permission: NorseOnePermission
) {
  const session = await requireAuthentication();

  const role = session.user.role as NorseOneRole;

  if (!roleHasPermission(role, permission)) {
    throw new AuthorizationError(
      "Your account does not have permission to perform this action."
    );
  }

  return session;
}