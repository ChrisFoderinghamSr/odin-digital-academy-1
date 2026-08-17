import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Create a Family Account",
    description:
      "A parent or authorized guardian establishes the family profile and begins the application.",
  },
  {
    number: "02",
    title: "Complete the Application",
    description:
      "Provide required family, student, academic, contact, and authorization information.",
  },
  {
    number: "03",
    title: "Submit Documentation",
    description:
      "Upload the records and supporting documents required by the academy and applicable jurisdiction.",
  },
  {
    number: "04",
    title: "Academic Review",
    description:
      "The academy evaluates placement information and determines the appropriate academic pathway.",
  },
  {
    number: "05",
    title: "Admissions Decision",
    description:
      "The application is reviewed and the family receives an admissions decision through the platform.",
  },
  {
    number: "06",
    title: "Enrollment",
    description:
      "Accepted students transition directly from admissions into enrollment and Norse One.",
  },
];

export default function AdmissionsPage() {
  return (
    <main className="public-page">
      <section className="admissions-hero">
        <div className="container page-hero-content">
          <span className="section-label">ADMISSIONS PLATFORM</span>

          <h1>
            Begin the journey.
            <span> Become a Raven.</span>
          </h1>

          <p>
            Odin Digital Academy uses one connected admissions and enrollment
            experience designed to make the transition from applicant to
            student simple and transparent.
          </p>

          <div className="hero-actions">
            <Link href="/admissions/apply" className="button button-gold">
              Start an Application
            </Link>

            <Link href="/admissions/status" className="button button-outline">
              Check Application Status
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-heading dark-heading">
            <span className="section-label">THE PROCESS</span>

            <h2>
              From application to
              <span> enrollment.</span>
            </h2>
          </div>

          <div className="admission-steps">
            {steps.map((step) => (
              <article className="admission-step" key={step.number}>
                <span>{step.number}</span>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-black">
        <div className="container split-section">
          <div>
            <span className="section-label gold-label">
              ADMISSION PHILOSOPHY
            </span>

            <h2>
              High standards.
              <br />
              <span>Human support.</span>
            </h2>
          </div>

          <div className="section-copy light-copy">
            <p>
              Admissions should evaluate readiness while respecting the
              individual circumstances of each family.
            </p>

            <p>
              Application requirements, documentation, placement assessments,
              and enrollment policies can be configured to meet the academy&apos;s
              operating requirements and applicable local regulations.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}