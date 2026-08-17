import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { roleHasPermission } from "@/lib/auth/permissions";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";
import CurriculumManager from "@/components/norse-one/curriculum/CurriculumManager";

import type { NorseOneRole } from "@/types/norse-one";

export default async function CurriculumManagementPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role as NorseOneRole;

  if (!roleHasPermission(role, "MANAGE_CURRICULUM")) {
    redirect("/norse-one/dashboard");
  }

  return (
    <NorseOneShell>
      <section className="norse-page-heading">
        <span>ADMINISTRATION</span>

        <h1>Curriculum Management</h1>

        <p>
          Create and maintain the Academy&apos;s
          grade-level academic programs, units, lessons,
          and learning resources.
        </p>
      </section>

      <CurriculumManager />
    </NorseOneShell>
  );
}