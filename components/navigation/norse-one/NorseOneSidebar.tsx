"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { NorseOneRole } from "@/types/norse-one";

interface NorseOneSidebarProps {
  role: NorseOneRole;
}

const navigation = [
  {
    label: "Dashboard",
    href: "/norse-one/dashboard",
    icon: "⌂",
    roles: [
      "ADMINISTRATOR",
      "DIRECTOR",
      "DEVELOPER",
      "TEACHER",
      "ASSISTANT",
      "SUPPORT",
      "PARENT",
      "STUDENT",
    ],
  },
  {
    label: "My Learning",
    href: "/norse-one/learning",
    icon: "◇",
    roles: ["STUDENT", "PARENT", "TEACHER", "ASSISTANT"],
  },
  {
    label: "Assignments",
    href: "/norse-one/assignments",
    icon: "✓",
    roles: ["STUDENT", "PARENT", "TEACHER", "ASSISTANT"],
  },
  {
    label: "Grades",
    href: "/norse-one/grades",
    icon: "A",
    roles: ["STUDENT", "PARENT", "TEACHER", "DIRECTOR"],
  },
  {
    label: "Curriculum",
    href: "/norse-one/curriculum",
    icon: "▤",
    roles: [
      "ADMINISTRATOR",
      "DIRECTOR",
      "TEACHER",
      "ASSISTANT",
      "PARENT",
      "STUDENT",
    ],
  },
  {
    label: "Attendance",
    href: "/norse-one/attendance",
    icon: "◷",
    roles: [
      "ADMINISTRATOR",
      "DIRECTOR",
      "TEACHER",
      "ASSISTANT",
      "PARENT",
      "STUDENT",
    ],
  },
  {
    label: "Messages",
    href: "/norse-one/messages",
    icon: "✉",
    roles: [
      "ADMINISTRATOR",
      "DIRECTOR",
      "TEACHER",
      "ASSISTANT",
      "SUPPORT",
      "PARENT",
      "STUDENT",
    ],
  },
  {
    label: "Family",
    href: "/norse-one/family",
    icon: "♧",
    roles: ["PARENT", "STUDENT"],
  },
  {
    label: "Admissions",
    href: "/norse-one/admissions",
    icon: "◇",
    roles: ["ADMINISTRATOR", "DIRECTOR", "SUPPORT", "PARENT"],
  },
  {
    label: "Enrollment",
    href: "/norse-one/enrollment",
    icon: "▣",
    roles: ["ADMINISTRATOR", "DIRECTOR", "SUPPORT", "PARENT"],
  },
  {
  label: "Curriculum Manager",
  href: "/norse-one/administration/curriculum",
  icon: "▤",
  roles: [
    "ADMINISTRATOR",
    "DIRECTOR",
    ],
  },
];

export default function NorseOneSidebar({
  role,
}: NorseOneSidebarProps) {
  const pathname = usePathname();

  const visibleNavigation = navigation.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <aside className="norse-sidebar">
      <div className="norse-sidebar-brand">
        <div className="norse-sidebar-logo">N</div>

        <div>
          <strong>NORSE ONE</strong>
          <span>ODIN DIGITAL ACADEMY</span>
        </div>
      </div>

      <div className="norse-sidebar-role">
        <span>ACTIVE ROLE</span>
        <strong>{role}</strong>
      </div>

      <nav className="norse-sidebar-navigation">
        {visibleNavigation.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/norse-one/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              href={item.href}
              className={`norse-nav-item ${active ? "active" : ""}`}
              key={item.href}
            >
              <span className="norse-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="norse-sidebar-bottom">
        <Link href="/">Academy Website</Link>
        
        <button
          type="button"
          className="norse-signout-button"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}