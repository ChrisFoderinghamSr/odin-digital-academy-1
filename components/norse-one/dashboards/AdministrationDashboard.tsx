// File introduced 2026-08-17 (fe05ed4).
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireAuthentication, requirePermission } from "@/lib/auth/authorization";
import { roleHasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/database/prisma";

async function review(form: FormData) {
  "use server";
  const decision = form.get("decision");
  if (decision !== "ACCEPTED" && decision !== "DECLINED") throw new Error("Choose an admissions decision.");
  const { user } = await requirePermission(decision === "ACCEPTED" ? "APPROVE_ADMISSION" : "DECLINE_ADMISSION");
  const id = String(form.get("id"));
  await prisma.$transaction(async tx => {
    const changed = await tx.admissionApplication.updateMany({ where: { id, status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
      data: { status: decision, reviewerId: user.id, reviewedAt: new Date() } });
    if (changed.count) await tx.auditLog.create({ data: { userId: user.id, action: decision, resource: "AdmissionApplication", resourceId: id } });
  });
  revalidatePath("/norse-one/dashboard");
}

export default async function AdministrationDashboard() {
  const { user } = await requireAuthentication();
  const canReview = roleHasPermission(user.role, "REVIEW_ADMISSION");
  const applications = canReview ? await prisma.admissionApplication.findMany({
    where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } }, orderBy: { submittedAt: "asc" },
  }) : [];
  return <><section className="norse-page-heading"><h1>Administration</h1><p>Signed in as {user.name}</p></section>
    {roleHasPermission(user.role, "MANAGE_CURRICULUM") && <Link className="button button-gold" href="/norse-one/administration/curriculum">Manage curriculum</Link>}
    <Link className="button button-outline" href="/norse-one/messages">Inbox</Link>
    {canReview && <section className="norse-message-panel"><h2>Admissions queue</h2>
      {!applications.length && <p>No applications are awaiting review.</p>}
      {applications.map(a => <article key={a.id}><strong>{a.studentFirstName} {a.studentLastName}</strong><p>Requested grade: {a.requestedGrade}</p>
        <form action={review}><input name="id" type="hidden" value={a.id}/>
          {roleHasPermission(user.role, "APPROVE_ADMISSION") && <button className="button" name="decision" value="ACCEPTED">Accept</button>}
          {roleHasPermission(user.role, "DECLINE_ADMISSION") && <button className="button" name="decision" value="DECLINED">Decline</button>}
        </form></article>)}</section>}
  </>;
}
