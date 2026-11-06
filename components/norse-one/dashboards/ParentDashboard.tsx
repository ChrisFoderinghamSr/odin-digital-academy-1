// File introduced 2026-08-17 (fe05ed4).
import Link from "next/link";
import { getMyFamily } from "@/lib/services/norse-one/family-service";


export default async function FamilyView() {
  const family = await getMyFamily();
  const records = family?.students.map(s => ({id:s.id,title:s.firstName+" "+s.lastName,detail:s.academicLevel})) ?? [];
  return (
    <>
      <section className="norse-page-heading"><span>Family workspace</span><h1>Family dashboard</h1><p>{family?.familyName}</p></section>
      <section className="enrollment-panel">
        {records.map(row => <article key={row.id}><strong>{row.title}</strong><p>{row.detail}</p></article>)}
        {!records.length && <p>No records are available for this household yet.</p>}
        <Link href="/norse-one/family">View family</Link>
      </section>
    </>
  );
}
