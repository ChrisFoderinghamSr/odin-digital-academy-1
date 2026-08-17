import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import NorseOneSidebar from "@/components/navigation/norse-one/NorseOneSidebar";
import { auth } from "@/auth";
import type { NorseOneRole } from "@/types/norse-one";

interface NorseOneShellProps {
  children: ReactNode;
  role?: NorseOneRole;
}

const validRoles: NorseOneRole[] = [
  "ADMINISTRATOR",
  "DIRECTOR",
  "DEVELOPER",
  "TEACHER",
  "ASSISTANT",
  "SUPPORT",
  "PARENT",
  "STUDENT",
];

function formatRole(role: NorseOneRole): string {
  return role
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

export default async function NorseOneShell({
  children,
  role: fallbackRole,
}: NorseOneShellProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sessionRole = session.user.role;

  const role = validRoles.includes(
    sessionRole as NorseOneRole
  )
    ? (sessionRole as NorseOneRole)
    : fallbackRole;

  if (!role) {
    redirect("/login");
  }

  const displayRole = formatRole(role);

  const fullName =
    session.user.name?.trim() || "Raven User";

  const nameParts = fullName.split(/\s+/);

  const firstName = nameParts[0] ?? "Raven";
  const lastNameInitial =
    nameParts.length > 1
      ? nameParts[nameParts.length - 1]?.charAt(0)
      : "";

  const initials = `${firstName.charAt(0)}${lastNameInitial}`.toUpperCase();

  return (
    <div className="norse-app">
      <NorseOneSidebar role={role} />

      <div className="norse-main">
        <header className="norse-topbar">
          <div className="norse-topbar-brand">
            <span className="norse-topbar-label">
              NORSE ONE
            </span>

            <strong>
              Learning &amp; Academy Portal
            </strong>
          </div>

          <div className="norse-user-area">
            <button
              className="norse-notification"
              aria-label="Notifications"
              type="button"
              title="Notifications"
            >
              ♢
            </button>

            <div
              className="norse-user-avatar"
              aria-hidden="true"
            >
              {initials}
            </div>

            <div className="norse-user-info">
              <strong>{fullName}</strong>

              <span>{displayRole}</span>
            </div>
          </div>
        </header>

        <main className="norse-content">
          {children}
        </main>

        <footer className="norse-footer">
          <span>
            © {new Date().getFullYear()} Odin Digital Academy
          </span>

          <span>NORSE ONE • Learning &amp; Academy Portal</span>
        </footer>
      </div>
    </div>
  );
}