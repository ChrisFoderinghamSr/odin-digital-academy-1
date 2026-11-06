// File introduced 2026-08-17 (fe05ed4).
import { revalidatePath } from "next/cache";
import { requireAuthentication, requirePermission } from "@/lib/auth/authorization";
import { roleHasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/database/prisma";
import { gradeSubmission } from "@/lib/services/norse-one/grading/grading-service";
import ClassroomRoster from "./ClassroomRoster";
import { z } from "zod";

async function publish(form: FormData) {
  "use server";
  const { user } = await requirePermission("PUBLISH_ASSIGNMENT");
  const input = z.object({
    classroomId: z.string().min(1), title: z.string().trim().min(1).max(200),
    instructions: z.string().trim().min(1).max(20000), points: z.coerce.number().int().min(1).max(10000),
  }).parse(Object.fromEntries(form));
  await prisma.$transaction(async tx => {
    const classroom = await tx.classroom.findFirstOrThrow({ where: { id: input.classroomId, active: true, teacher: { userId: user.id } }, include: { students: true } });
    // Publish the roster and assignment together so every target is immediately able to submit.
    await tx.assignment.create({ data: { title: input.title, instructions: input.instructions, pointsPossible: input.points,
      courseId: classroom.courseId, classroomId: classroom.id, createdById: user.id, targetType: "CLASSROOM", status: "PUBLISHED",
      targets: { create: classroom.students.map(({studentId}) => ({ studentId })) } } });
  });
  revalidatePath("/norse-one/dashboard");
}

async function grade(form: FormData) {
  "use server";
  const score = z.string().trim().min(1).regex(/^\d+$/).transform(Number).parse(form.get("score"));
  await gradeSubmission(String(form.get("submissionId")), score, String(form.get("feedback") ?? "").slice(0, 5000));
  revalidatePath("/norse-one/dashboard");
}

export default async function TeacherDashboard() {
  const { user } = await requireAuthentication();
  const classes = await prisma.classroom.findMany({ where: { active: true, teacher: { userId: user.id } }, orderBy: { name: "asc" } });
  const work = await prisma.submission.findMany({ where: { status: "SUBMITTED", assignment: { classroom: { teacher: { userId: user.id } } } },
    include: { assignment: true, student: true }, orderBy: { submittedAt: "asc" } });
  return <>
    <section className="norse-page-heading"><span>STAFF WORKSPACE</span><h1>Welcome, {user.name}</h1><p>{classes.length} classrooms · {work.length} submissions awaiting review</p></section>
    {classes.length > 0 && roleHasPermission(user.role, "PUBLISH_ASSIGNMENT") && <form action={publish} className="academy-form">
      <h2>Publish an assignment</h2>
      <label>Classroom<select name="classroomId">{classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Title<input required name="title" maxLength={200}/></label>
      <label>Instructions<textarea required name="instructions" maxLength={20000}/></label>
      <label>Points possible<input required type="number" name="points" min="1" max="10000"/></label>
      <button className="button button-gold">Publish to classroom</button>
    </form>}
    <ClassroomRoster />
    <section className="norse-message-panel"><h2>Grading queue</h2>
      {!work.length && <p>No submissions are waiting.</p>}
      {work.map(s => <article key={s.id}><h3>{s.assignment.title}</h3><p>{s.student.firstName} {s.student.lastName}</p><p>{s.responseText}</p>
        {roleHasPermission(user.role, "GRADE_ASSIGNMENT") && <form action={grade} className="academy-form">
          <input type="hidden" name="submissionId" value={s.id}/><label>Points out of {s.assignment.pointsPossible}<input type="number" required name="score" min="0" max={s.assignment.pointsPossible}/></label>
          <label>Feedback<textarea name="feedback" maxLength={5000}/></label><button className="button button-gold">Record grade</button>
        </form>}</article>)}
    </section>
  </>;
}


