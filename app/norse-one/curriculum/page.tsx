import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

const curriculum = [
  "Mathematics",
  "Reading & Literature",
  "Writing",
  "Science",
  "Social Studies",
  "Technology",
  "Financial Literacy",
  "Life Skills",
  "Character & Leadership",
  "Creative Arts",
  "Physical Education",
  "Digital Citizenship",
];

export default function CurriculumPage() {
  return (
    <NorseOneShell role="STUDENT">
      <section className="norse-page-heading">
        <span>GRADE 5</span>
        <h1>Curriculum</h1>
        <p>
          Your academic roadmap for the current preparatory year.
        </p>
      </section>

      <section className="norse-curriculum-grid">
        {curriculum.map((subject, index) => (
          <article className="norse-curriculum-card" key={subject}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{subject}</strong>
            <small>View learning guide →</small>
          </article>
        ))}
      </section>
    </NorseOneShell>
  );
}