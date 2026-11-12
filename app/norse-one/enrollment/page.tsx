import {account,studentsFor} from "@/lib/academy/access";
import {prisma} from "@/lib/database/prisma";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";
export default async function EnrollmentPage(){
  const user = await account();
  const rows = await prisma.enrollment.findMany({where:{student:studentsFor(user)},include:{student:true,semester:true,academicYear:true},orderBy:{enrolledAt:"desc"}});
  return <NorseOneShell><h1>Enrollment</h1>{!rows.length && <p>No enrollment records are available.</p>}
    {rows.map(e=><article className="norse-grade-card" key={e.id}><h2>{e.student.firstName} {e.student.lastName}</h2>
      <p>{e.student.academicLevel} · {e.academicYear.name} · {e.semester.name}</p><strong>{e.status}</strong></article>)}</NorseOneShell>;
}
