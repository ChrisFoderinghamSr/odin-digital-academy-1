import {account,coursesFor} from "@/lib/academy/access";
import {prisma} from "@/lib/database/prisma";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";
export default async function ResourcesPage() {
  const curriculum = {published:true,course:coursesFor(await account())};
  const rows = await prisma.resource.findMany({where:{OR:[{unit:{curriculum}},{lesson:{unit:{curriculum}}}]},orderBy:{title:"asc"}});
  return <NorseOneShell><h1>Course resources</h1>{!rows.length && <p>No resources have been published for your courses.</p>}
    {rows.map(r=><article key={r.id} className="norse-resource-card"><h2>{r.title}</h2><p>{r.description}</p>
      {r.url && /^https?:\/\//i.test(r.url) && <a href={r.url}>Open resource</a>}</article>)}</NorseOneShell>;
}
