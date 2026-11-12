import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/database/prisma";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

async function instructor() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  if (session.user.role !== "TEACHER") redirect("/norse-one/dashboard");
  return session.user.id;
}

async function publish(form: FormData) {
  "use server";
  const id = await instructor();
  const title = String(form.get("title") ?? "").trim();
  const instructions = String(form.get("instructions") ?? "").trim();
  const points = Number(form.get("points"));
  if (!title || title.length > 200 || !instructions || instructions.length > 20000 ||
      !Number.isInteger(points) || points < 1 || points > 10000) throw new Error("Check assignment fields.");
  const classroom = await prisma.classroom.findFirst({
    where: { id: String(form.get("room")), active: true, course: { active: true, instructor: { userId: id } } },
    include: { students: { select: { studentId: true } } },
  });
  if (!classroom?.students.length) throw new Error("Choose a classroom with enrolled students.");
  await prisma.assignment.create({ data: { title, instructions, pointsPossible: points, courseId: classroom.courseId,
    classroomId: classroom.id, targetType: "CLASSROOM", createdById: id, status: "PUBLISHED",
    targets: { create: classroom.students } } });
  revalidatePath("/norse-one/review");
}

async function grade(form: FormData) {
  "use server";
  const id = await instructor();
  const raw = String(form.get("score") ?? "");
  const feedback = String(form.get("feedback") ?? "").trim();
  if (!/^\d+$/.test(raw) || feedback.length > 5000) throw new Error("Enter a valid grade and feedback.");
  const score = Number(raw);
  const where = { id: String(form.get("submission")), status: "SUBMITTED" as const,
    assignment: { course: { instructor: { userId: id } } } };
  await prisma.$transaction(async tx => {
    const row = await tx.submission.findFirst({where, include:{assignment:true}});
    if (!row || row.assignment.pointsPossible <= 0 || score > row.assignment.pointsPossible) throw new Error("Check the score and submission.");
    const gradedAt = new Date();
    const result = await tx.submission.updateMany({ where, data:{score, feedback, gradedAt, status:"GRADED"} });
    if (result.count !== 1) throw new Error("Already reviewed.");
    await tx.gradeRecord.create({ data:{ submissionId:row.id, courseId:row.assignment.courseId, studentId:row.studentId,
      score:Math.round(score * 10000 / row.assignment.pointsPossible) / 100, feedback, gradedAt, gradedById:id } });
  });
  revalidatePath("/norse-one/review");
  revalidatePath("/norse-one/grades");
}

export default async function ReviewPage() {
  const id = await instructor();
  const [rooms, pending, published] = await Promise.all([
    prisma.classroom.findMany({where:{active:true,students:{some:{}},course:{active:true,instructor:{userId:id}}},orderBy:{name:"asc"}}),
    prisma.submission.findMany({where:{status:"SUBMITTED",assignment:{course:{instructor:{userId:id}}}},include:{student:true,assignment:true},orderBy:{submittedAt:"asc"}}),
    prisma.assignment.findMany({where:{createdById:id},orderBy:{createdAt:"desc"},take:20}),
  ]);
  return <NorseOneShell><h1>Teaching workspace</h1><h2>Publish an assignment</h2>
    {rooms.length ? <form action={publish} className="norse-grade-card">
      <label>Classroom <select name="room">{rooms.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
      <label>Title <input name="title" maxLength={200} required/></label>
      <label>Instructions <textarea name="instructions" maxLength={20000} required/></label>
      <label>Points possible <input type="number" name="points" min={1} max={10000} required/></label><button>Publish assignment</button>
    </form> : <p>An enrolled classroom is required to publish work.</p>}
    <ul>{published.map(a=><li key={a.id}>{a.title} · {a.status}</li>)}</ul>
    <h2>Review submissions</h2>{!pending.length && <p>No submissions await review.</p>}
    {pending.map(s=><article key={s.id} className="norse-grade-card"><h3>{s.assignment.title}</h3>
      <p>{s.student.firstName} {s.student.lastName}</p><p style={{whiteSpace:"pre-wrap"}}>{s.responseText}</p>
      <form action={grade}><input type="hidden" name="submission" value={s.id}/>
        <label>Points out of {s.assignment.pointsPossible} <input name="score" type="number" min={0} max={s.assignment.pointsPossible} required/></label>
        <label>Feedback <textarea name="feedback" maxLength={5000}/></label><button>Save grade</button>
      </form></article>)}</NorseOneShell>;
}
