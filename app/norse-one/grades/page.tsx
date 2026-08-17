import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

const grades = [
  ["Mathematics", "94%", "A", "Ms. Raven"],
  ["Reading & Literature", "91%", "A-", "Mrs. Ellis"],
  ["Science", "89%", "B+", "Mr. Carter"],
  ["Life Skills", "96%", "A", "Ms. Morgan"],
];

export default function GradesPage() {
  return (
    <NorseOneShell role="STUDENT">
      <section className="norse-page-heading">
        <span>ACADEMIC PERFORMANCE</span>
        <h1>Grades</h1>
        <p>Track academic performance and instructor evaluations.</p>
      </section>

      <section className="norse-grade-grid">
        {grades.map(([course, percentage, letter, instructor]) => (
          <article className="norse-grade-card" key={course}>
            <span>{course}</span>
            <strong>{percentage}</strong>
            <b>{letter}</b>
            <small>{instructor}</small>
          </article>
        ))}
      </section>
    </NorseOneShell>
  );
}