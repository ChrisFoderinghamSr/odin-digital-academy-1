import Link from "next/link";

export default function ScholarshipsPage() {
  return (
    <main className="public-page">
      <section className="scholarship-section scholarship-page-hero">
        <div className="container scholarship-content">
          <span className="section-label gold-label">ACCESS & OPPORTUNITY</span>

          <h1>
            Give students the
            <span> tools to learn.</span>
          </h1>

          <p>
            Odin Digital Academy's scholarship model is designed to support
            access to education and technology for qualifying students.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container program-grid">
          <article className="program-card">
            <div className="program-top">
              <span>ACADEMIC</span>
              <span>01</span>
            </div>

            <h3>Learning Support</h3>

            <p>
              Scholarship opportunities may support access to the academy's
              core educational program according to established eligibility
              requirements.
            </p>
          </article>

          <article className="program-card">
            <div className="program-top">
              <span>TECHNOLOGY</span>
              <span>02</span>
            </div>

            <h3>Laptop Scholarship</h3>

            <p>
              Qualifying students may receive technology support including a
              laptop, required software, configuration, and coursework setup.
            </p>
          </article>

          <article className="program-card">
            <div className="program-top">
              <span>PARTNERSHIP</span>
              <span>03</span>
            </div>

            <h3>Sponsored Learning</h3>

            <p>
              Organizations and supporters may contribute toward educational
              access, technology, curriculum, and student development.
            </p>
          </article>
        </div>
      </section>

      <section className="admissions-cta">
        <div className="container admissions-cta-content">
          <div>
            <span className="section-label">LEARN MORE</span>
            <h2>Explore the academy.</h2>
          </div>

          <Link href="/admissions" className="button button-gold">
            Admissions
          </Link>
        </div>
      </section>
    </main>
  );
}