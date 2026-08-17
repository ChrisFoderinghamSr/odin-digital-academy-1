import { auth } from "@/auth";

import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";
import StudentDashboard from "@/components/norse-one/dashboards/StudentDashboard";
import ParentDashboard from "@/components/norse-one/dashboards/ParentDashboard";
import TeacherDashboard from "@/components/norse-one/dashboards/TeacherDashboard";
import AdministrationDashboard from "@/components/norse-one/dashboards/AdministrationDashboard";

import type { NorseOneRole } from "@/types/norse-one";

export default async function DashboardPage() {
  const session = await auth();

  const role = session?.user?.role as NorseOneRole;

  return (
    <NorseOneShell>
      {role === "STUDENT" && <StudentDashboard />}

      {role === "PARENT" && <ParentDashboard />}

      {(role === "TEACHER" || role === "ASSISTANT") && (
        <TeacherDashboard />
      )}

      {(
        role === "ADMINISTRATOR" ||
        role === "DIRECTOR" ||
        role === "DEVELOPER" ||
        role === "SUPPORT"
      ) && <AdministrationDashboard />}

      {!role && (
        <section className="norse-page-heading">
          <span>ACCOUNT</span>
          <h1>Workspace unavailable.</h1>
          <p>
            Your authenticated role could not be determined.
          </p>
        </section>
      )}
    </NorseOneShell>
  );
}