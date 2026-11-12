import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {prisma} from "@/lib/database/prisma";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

export default async function GradesPage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const {id, role} = session.user;
  if (role === "TEACHER") redirect("/norse-one/review");
  const studentScope = role === "PARENT" ? {family:{parents:{some:{userId:id,verified:true}}}} : {userId:id};
  const grades = await prisma.gradeRecord.findMany({where:{student:studentScope},include:{student:true,course:true,
    submission:{include:{assignment:true}}},orderBy:{gradedAt:"desc"}});
  return <NorseOneShell><h1>Grades</h1>{!grades.length && <p>No grades have been recorded for this account.</p>}
    {grades.map(g=><article key={g.id} className="norse-grade-card"><h2>{g.submission?.assignment.title ?? g.course.name}</h2>
      <p>{g.student.firstName} · {g.course.name}</p><strong>{g.score.toString()}%</strong><p>{g.feedback}</p></article>)}</NorseOneShell>;
}
