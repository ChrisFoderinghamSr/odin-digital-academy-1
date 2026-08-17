import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

export default function NorseOneAdmissionsPage() {
  return (
    <NorseOneShell role="PARENT">
      <section className="norse-page-heading">
        <span>FAMILY SERVICES</span>
        <h1>Admissions</h1>
        <p>
          Review application information, required documents, and admissions
          progress.
        </p>
      </section>

      <section className="norse-admission-status">
        <div>
          <span>APPLICATION STATUS</span>
          <strong>Under Review</strong>
        </div>

        <div>
          <span>APPLICATION ID</span>
          <strong>ODA-2026-0001</strong>
        </div>

        <div>
          <span>STUDENT</span>
          <strong>Raven Student</strong>
        </div>

        <div>
          <span>PROGRAM</span>
          <strong>Grade 5</strong>
        </div>
      </section>
    </NorseOneShell>
  );
}