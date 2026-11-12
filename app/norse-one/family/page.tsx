import {account} from "@/lib/academy/access";
import {prisma} from "@/lib/database/prisma";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";
export default async function FamilyPage(){
  const user = await account();
  const family = await prisma.family.findFirst({where:{OR:[
    {parents:{some:{userId:user.id,verified:true}}},{students:{some:{userId:user.id}}},
  ]}, include:{students:true,parents:{where:{verified:true},include:{user:{select:{firstName:true,lastName:true}}}}}});
  return <NorseOneShell><h1>Family</h1>{family ? <article className="norse-grade-card"><h2>{family.familyName}</h2>
    <h3>Students</h3>{family.students.map(s=><p key={s.id}>{s.firstName} {s.lastName} · {s.academicLevel}</p>)}
    <h3>Guardians</h3>{family.parents.map(p=><p key={p.id}>{p.user.firstName} {p.user.lastName} · {p.relationship}</p>)}
    </article> : <p>No family profile is linked to this account.</p>}</NorseOneShell>;
}
