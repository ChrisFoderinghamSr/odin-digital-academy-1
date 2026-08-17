import type { ReactNode } from "react";

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

export default async function NorseOneShell({
  children,
  role: fallbackRole = "STUDENT",
}: NorseOneShellProps) {
  const session = await auth();

  const sessionRole = session?.user?.role;

  const role = validRoles.includes(
    sessionRole as NorseOneRole
  )
    ? (sessionRole as NorseOneRole)
    : fallbackRole;

  const firstName =
    session?.user?.name?.split(" ")[0] ?? "Raven";

  return (
    <div className="norse-app">
      <NorseOneSidebar role={role} />

      <div className="norse-main">
        <header className="norse-topbar">
          <div>
            <span className="norse-topbar-label">
              NORSE ONE
            </span>

            <strong>
              Learning & Academy Portal
            </strong>
          </div>

          <div className="norse-user-area">
            <button
              className="norse-notification"
              aria-label="Notifications"
              type="button"
            >
              ♢
            </button>

            <div className="norse-user-avatar">
              {firstName.charAt(0)}
              {session?.user?.name
                ?.split(" ")[1]
                ?.charAt(0) ?? ""}
            </div>

            <div className="norse-user-info">
              <strong>
                {session?.user?.name ?? "Raven User"}
              </strong>

              <span>{role}</span>
            </div>
          </div>
        </header>

        <main className="norse-content">
          {children}
        </main>
      </div>
    </div>
  );
}