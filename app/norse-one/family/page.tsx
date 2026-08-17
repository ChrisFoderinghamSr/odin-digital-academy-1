import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

export default function FamilyPage() {
  return (
    <NorseOneShell role="PARENT">
      <section className="norse-page-heading">
        <span>FAMILY CONNECTION</span>
        <h1>Family</h1>
        <p>
          Manage the connection between parent accounts and student records.
        </p>
      </section>

      <section className="family-profile-grid">
        <article className="family-profile-card">
          <span>PARENT / GUARDIAN</span>
          <h2>Christian Foderingham</h2>
          <p>Primary Parent / Guardian</p>
          <strong>Account Verified</strong>
        </article>

        <article className="family-profile-card student-profile">
          <span>STUDENT</span>
          <h2>Raven Student</h2>
          <p>Grade 5 • Preparatory Academy</p>
          <strong>Enrollment Active</strong>
        </article>
      </section>
    </NorseOneShell>
  );
}