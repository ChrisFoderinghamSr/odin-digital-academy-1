import {account,coursesFor} from "@/lib/academy/access";
import {prisma} from "@/lib/database/prisma";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";
export default async function CurriculumPage(){
  const user = await account();
  const rows = await prisma.curriculum.findMany({where:{published:true,course:coursesFor(user)},include:{course:true,units:{orderBy:{sequence:"asc"},include:{lessons:{orderBy:{sequence:"asc"}}}}},orderBy:{title:"asc"}});
  return <NorseOneShell><h1>Curriculum</h1>{!rows.length && <p>No curriculum is published for your courses.</p>}
    {rows.map(c=><article key={c.id} className="norse-grade-card"><small>{c.course.name}</small><h2>{c.title}</h2><p>{c.description}</p>
      {c.units.map(u=><details key={u.id}><summary>{u.title}</summary><p>{u.description}</p>
        <ol>{u.lessons.map(l=><li key={l.id}><strong>{l.title}</strong><p>{l.description}</p><p>{l.objectives}</p></li>)}</ol></details>)}</article>)}</NorseOneShell>;
}
