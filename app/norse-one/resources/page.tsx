// File introduced 2026-08-17 (fe05ed4).
import { requireAuthentication } from "@/lib/auth/authorization";
import { prisma } from "@/lib/database/prisma";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

export default async function ResourcesPage() {
  const { user } = await requireAuthentication();
  // A resource may belong to a unit or one of its lessons. Both paths must lead to an enrolled course.
  const curriculum = { published: true, course: { classrooms: { some: { active: true, students: { some: { student: { userId: user.id } } } } } } };
  const resources = await prisma.resource.findMany({ where: { type: { notIn: ["INSTRUCTOR_RESOURCE", "PARENT_RESOURCE"] },
    OR: [{ unit: { curriculum } }, { lesson: { unit: { curriculum } } }] }, orderBy: { title: "asc" } });
  return <NorseOneShell role={user.role}><section className="norse-page-heading"><h1>Learning resources</h1></section>
    <section className="norse-resource-grid">{!resources.length && <p>Your courses have no published materials yet.</p>}
      {resources.map(r => <article key={r.id} className="norse-resource-card"><span>{r.type}</span><h2>{r.title}</h2><p>{r.description}</p>
        {r.url && /^https?:\/\//i.test(r.url) && <a href={r.url}>Open resource</a>}</article>)}
    </section></NorseOneShell>;
}
