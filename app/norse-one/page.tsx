import Link from "next/link";

const features = [
  "Admissions",
  "Enrollment",
  "Curriculum",
  "Learning",
  "Assignments",
  "Grades",
  "Attendance",
  "Family",
  "Resources",
  "Communication",
  "Scholarships",
  "Reports",
];

export default function NorseOnePage() {
  return (
    <main className="public-page">
      <section className="norse-one-hero">
        <div className="container norse-one-hero-content">
          <span className="section-label">ODIN DIGITAL ACADEMY</span>

          <div className="norse-one-title">
            <span className="norse-one-symbol">N</span>

            <div>
              <h1>Norse One</h1>
              <p>Integrated Learning & Admissions Platform</p>
            </div>
          </div>

          <p className="norse-one-intro">
            One connected digital environment for admissions, enrollment,
            curriculum, learning, academic progress, families, instructors,
            and academy administration.
          </p>

          <div className="hero-actions">
            <Link href="/login" className="button button-gold">
              Enter Norse One
            </Link>

            <Link href="/admissions" className="button button-outline">
              Admissions
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-heading dark-heading">
            <span className="section-label">ONE PLATFORM</span>
            <h2>
              Everything connected.
              <span> Nothing fragmented.</span>
            </h2>
          </div>

          <div className="norse-feature-grid">
            {features.map((feature, index) => (
              <article className="norse-feature-card" key={feature}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{feature}</h3>
                <p>
                  Connected tools and workflows inside the Norse One academy
                  environment.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}