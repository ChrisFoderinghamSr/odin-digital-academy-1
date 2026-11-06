// File introduced 2026-08-17 (fe05ed4).
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getMyFamily } from "@/lib/services/norse-one/family-service";
import { prisma } from "@/lib/database/prisma";

async function apply(form: FormData) {
  "use server";
  const family = await getMyFamily();
  if (!family) throw new Error("A guardian profile is required.");
  const values = z.object({
    studentFirstName: z.string().trim().min(1).max(100), studentLastName: z.string().trim().min(1).max(100),
    requestedGrade: z.string().trim().min(1).max(40), reference: z.string().uuid(),
  }).parse(Object.fromEntries(form));
  // A repeated submit from the same form returns the same application for this household.
  const applicationNumber = family.id + "-" + values.reference;
  await prisma.admissionApplication.upsert({ where: { applicationNumber }, update: {},
    create: { familyId: family.id, applicationNumber, studentFirstName: values.studentFirstName,
      studentLastName: values.studentLastName, requestedGrade: values.requestedGrade, status: "SUBMITTED", submittedAt: new Date() } });
  redirect("/norse-one/admissions");
}

export default async function ApplyPage() {
  const family = await getMyFamily();
  return <main className="public-page"><section className="section section-white"><div className="container application-card">
    <h1>Apply for admission</h1>
    {family ? <form className="academy-form" action={apply}>
      <p>Submit an application for a student in the {family.familyName} household.</p>
      <input type="hidden" name="reference" value={randomUUID()}/>
      <label>Student first name<input required name="studentFirstName" maxLength={100}/></label>
      <label>Student last name<input required name="studentLastName" maxLength={100}/></label>
      <label>Requested grade<input required name="requestedGrade" maxLength={40}/></label>
      <button className="button button-gold">Submit application</button>
    </form> : <p>Ask the academy to connect your guardian account to your household before applying.</p>}
  </div></section></main>;
}
