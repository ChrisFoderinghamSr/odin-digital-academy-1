import { redirect } from "next/navigation";

import { auth } from "@/auth";

import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

import StudentDashboard from "@/components/norse-one/dashboards/StudentDashboard";
import ParentDashboard from "@/components/norse-one/dashboards/ParentDashboard";
import TeacherDashboard from "@/components/norse-one/dashboards/TeacherDashboard";
import AdministrationDashboard from "@/components/norse-one/dashboards/AdministrationDashboard";

import type { NorseOneRole } from "@/types/norse-one";

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

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sessionRole = session.user.role;

  if (
    !validRoles.includes(
      sessionRole as NorseOneRole
    )
  ) {
    redirect("/login");
  }

  const role = sessionRole as NorseOneRole;

  return (
    <NorseOneShell role={role}>
      {role === "STUDENT" && (
        <StudentDashboard />
      )}

      {role === "PARENT" && (
        <ParentDashboard />
      )}

      {(role === "TEACHER" ||
        role === "ASSISTANT") && (
        <TeacherDashboard />
      )}

      {(role === "ADMINISTRATOR" ||
        role === "DIRECTOR" ||
        role === "DEVELOPER" ||
        role === "SUPPORT") && (
        <AdministrationDashboard />
      )}
    </NorseOneShell>
  );
}