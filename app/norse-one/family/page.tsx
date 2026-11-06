// File introduced 2026-08-17 (fe05ed4).
import Link from "next/link";
import { getMyFamily } from "@/lib/services/norse-one/family-service";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

export default async function FamilyView() {
  const family = await getMyFamily();
  const records = family?.students.map(s => ({id:s.id,title:s.firstName+" "+s.lastName,detail:s.academicLevel})) ?? [];
  return (
    <NorseOneShell role="PARENT">
      <section className="norse-page-heading"><span>Family connection</span><h1>My family</h1><p>{family?.familyName}</p></section>
      <section className="enrollment-panel">
        {records.map(row => <article key={row.id}><strong>{row.title}</strong><p>{row.detail}</p></article>)}
        {!records.length && <p>No records are available for this household yet.</p>}
        <Link href="/norse-one/enrollment">View enrollment</Link>
      </section>
    </NorseOneShell>
  );
}
