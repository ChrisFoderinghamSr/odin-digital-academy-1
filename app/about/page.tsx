import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="public-page">
      <section className="page-hero">
        <div className="container page-hero-content">
          <span className="section-label">ODIN DIGITAL ACADEMY</span>
          <h1>
            Education built for
            <span> the whole child.</span>
          </h1>
          <p>
            Odin Digital Academy combines rigorous academics, character,
            technology, leadership, and practical life experiences in one
            connected learning environment.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container split-section">
          <div>
            <span className="section-label">OUR MISSION</span>
            <h2>
              Knowledge creates
              <span> possibility.</span>
            </h2>
          </div>

          <div className="section-copy">
            <p>
              Our mission is to create an accessible, demanding, and supportive
              educational environment where students develop the knowledge and
              confidence required to navigate an increasingly complex world.
            </p>

            <p>
              Students are challenged academically while also learning how to
              communicate, manage responsibility, solve problems, use
              technology, understand money, and contribute positively to their
              communities.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-black">
        <div className="container">
          <div className="section-heading">
            <span className="section-label gold-label">OUR VALUES</span>
            <h2>
              What we expect
              <br />
              from every <span>Raven.</span>
            </h2>
          </div>

          <div className="pillar-grid">
            <article className="pillar-card">
              <span className="pillar-number">01</span>
              <h3>Curiosity</h3>
              <p>
                Students are encouraged to ask questions, explore ideas, and
                develop a lifelong desire to learn.
              </p>
            </article>

            <article className="pillar-card">
              <span className="pillar-number">02</span>
              <h3>Character</h3>
              <p>
                Academic ability is strengthened by integrity, responsibility,
                respect, perseverance, and self-discipline.
              </p>
            </article>

            <article className="pillar-card">
              <span className="pillar-number">03</span>
              <h3>Leadership</h3>
              <p>
                Students learn to communicate clearly, make responsible
                decisions, solve problems, and take ownership of their growth.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="admissions-cta">
        <div className="container admissions-cta-content">
          <div>
            <span className="section-label">READY TO LEARN?</span>
            <h2>Begin the Odin journey.</h2>
          </div>

          <Link href="/admissions" className="button button-gold">
            Explore Admissions
          </Link>
        </div>
      </section>
    </main>
  );
}