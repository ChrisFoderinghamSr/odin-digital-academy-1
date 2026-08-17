import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

const requirements = [
  ["Student Information", "Complete"],
  ["Parent / Guardian Information", "Complete"],
  ["Academic Records", "Complete"],
  ["Required Documents", "Pending"],
  ["Enrollment Agreement", "Pending"],
];

export default function EnrollmentPage() {
  return (
    <NorseOneShell role="PARENT">
      <section className="norse-page-heading">
        <span>ENROLLMENT</span>
        <h1>Enrollment Center</h1>
        <p>
          Complete the remaining steps required to transition from admission
          into active enrollment.
        </p>
      </section>

      <section className="enrollment-panel">
        {requirements.map(([requirement, status]) => (
          <article key={requirement}>
            <div>
              <span>{requirement}</span>
              <strong>{status}</strong>
            </div>

            <span
              className={
                status === "Complete"
                  ? "enrollment-complete"
                  : "enrollment-pending"
              }
            >
              {status === "Complete" ? "✓" : "!"}
            </span>
          </article>
        ))}
      </section>
    </NorseOneShell>
  );
}