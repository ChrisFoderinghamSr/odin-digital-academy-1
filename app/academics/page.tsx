import Link from "next/link";

const programs = [
  {
    title: "Raven Nest",
    grades: "Toddlers • Pre-K 4 • Pre-K 5",
    description:
      "Early development through language, discovery, social development, foundational mathematics, creativity, and school readiness.",
  },
  {
    title: "Primary Academy",
    grades: "Kindergarten • 1st • 2nd Grade",
    description:
      "Foundational literacy, mathematics, science, social studies, technology, character development, and practical learning.",
  },
  {
    title: "Preparatory Academy",
    grades: "3rd • 4th • 5th Grade",
    description:
      "Increasingly independent coursework with research, projects, interactive assignments, technology, leadership, and instructor assessment.",
  },
];

const subjects = [
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

export default function AcademicsPage() {
  return (
    <main className="public-page">
      <section className="page-hero">
        <div className="container page-hero-content">
          <span className="section-label">ACADEMICS</span>
          <h1>
            A serious academic foundation with
            <span> room to grow.</span>
          </h1>
          <p>
            Our learning model progresses from early development through a
            structured fifth-grade preparatory curriculum.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-heading dark-heading">
            <span className="section-label">ACADEMIC PATHWAY</span>
            <h2>
              Every stage has a
              <span> purpose.</span>
            </h2>
          </div>

          <div className="program-grid">
            {programs.map((program) => (
              <article className="program-card" key={program.title}>
                <div className="program-top">
                  <span>ACADEMIC PATHWAY</span>
                  <span>RAVEN</span>
                </div>

                <h3>{program.title}</h3>
                <strong>{program.grades}</strong>
                <p>{program.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-black">
        <div className="container">
          <div className="section-heading">
            <span className="section-label gold-label">CURRICULUM</span>
            <h2>
              Twelve learning areas.
              <br />
              <span>One complete education.</span>
            </h2>
          </div>

          <div className="subject-grid">
            {subjects.map((subject, index) => (
              <div className="subject-item" key={subject}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{subject}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="norse-section">
        <div className="container norse-grid">
          <div className="norse-mark">
            <div className="norse-circle">
              <span>N</span>
            </div>
          </div>

          <div>
            <span className="section-label">DIGITAL LEARNING</span>
            <h2>
              Powered by <span>Norse One.</span>
            </h2>
            <p>
              Curriculum, assignments, progress, resources, communication, and
              academic records are connected through one integrated learning
              environment.
            </p>

            <Link href="/norse-one" className="button button-gold">
              Explore Norse One
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}