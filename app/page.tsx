import Link from "next/link";
import Image from "next/image";

const programs = [
  {
    title: "Early Learning",
    grades: "Toddlers • Pre-K 4 • Pre-K 5",
    description:
      "A nurturing foundation focused on discovery, language, early mathematics, social development, creativity, and school readiness.",
  },
  {
    title: "Primary Academy",
    grades: "Kindergarten • 1st • 2nd Grade",
    description:
      "Foundational academics combined with reading, mathematics, science, character development, technology, and practical life skills.",
  },
  {
    title: "Preparatory Academy",
    grades: "3rd • 4th • 5th Grade",
    description:
      "A rigorous elementary curriculum emphasizing independent learning, critical thinking, research, technology, projects, and leadership.",
  },
];

const pillars = [
  {
    number: "01",
    title: "Academic Excellence",
    description:
      "Structured curriculum designed to develop strong foundations in reading, writing, mathematics, science, technology, and critical thinking.",
  },
  {
    number: "02",
    title: "Character & Leadership",
    description:
      "Students develop responsibility, discipline, communication, integrity, confidence, and leadership through age-appropriate experiences.",
  },
  {
    number: "03",
    title: "Life-Ready Learning",
    description:
      "Education extends beyond textbooks with financial literacy, technology, organization, problem solving, and real-world skills.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-background" />

        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow">ODIN DIGITAL ACADEMY</span>

            <h1>
              Think.
              <br />
              Learn.
              <br />
              Remember.
              <br />
              <span>Lead.</span>
            </h1>

            <p className="hero-description">
              A rigorous, faith-informed digital preparatory academy
              developing knowledge, character, technology skills, leadership,
              and real-world readiness from early childhood through elementary
              education.
            </p>

            <div className="hero-actions">
              <Link href="/admissions" className="button button-gold">
                Explore Admissions
              </Link>

              <Link href="/norse-one" className="button button-outline">
                Enter Norse One
              </Link>
            </div>

            <div className="hero-meta">
              <div>
                <strong>K–5</strong>
                <span>Preparatory Education</span>
              </div>

              <div>
                <strong>12</strong>
                <span>Learning Areas</span>
              </div>

              <div>
                <strong>∞</strong>
                <span>Potential</span>
              </div>
            </div>
          </div>

          <div className="hero-crest">
            <div className="crest-frame">
              <div className="crest-glow" />
              <Image
                src="/images/branding/odin-raven-crest.png"
                alt="Odin Digital Academy raven crest"
                width={1024}
                height={1024}
                priority
              />
            </div>

            <div className="crest-caption">
              <span>RAVEN ACADEMY</span>
              <small>Knowledge • Character • Leadership</small>
            </div>
          </div>
        </div>
      </section>

      {/* Academy Introduction */}
      <section className="section section-white">
        <div className="container split-section">
          <div>
            <span className="section-label">THE ACADEMY</span>
            <h2>
              Preparing young minds for a lifetime of{" "}
              <span>excellence.</span>
            </h2>
          </div>

          <div className="section-copy">
            <p>
              Odin Digital Academy is designed around a simple principle:
              education should prepare children not only to pass the next
              grade, but to become capable, curious, responsible, and
              confident people.
            </p>

            <p>
              Our academic model combines rigorous foundational learning with
              technology, life skills, character development, leadership, and
              meaningful real-world experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Pillars */}
      <section className="section section-black">
        <div className="container">
          <div className="section-heading">
            <span className="section-label gold-label">OUR PHILOSOPHY</span>
            <h2>
              More than lessons.
              <br />
              <span>A complete education.</span>
            </h2>
          </div>

          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article className="pillar-card" key={pillar.number}>
                <span className="pillar-number">{pillar.number}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section section-white">
        <div className="container">
          <div className="section-heading dark-heading">
            <span className="section-label">ACADEMIC PROGRAM</span>
            <h2>
              A learning journey built
              <br />
              <span>one stage at a time.</span>
            </h2>
          </div>

          <div className="program-grid">
            {programs.map((program) => (
              <article className="program-card" key={program.title}>
                <div className="program-top">
                  <span>ACADEMIC PROGRAM</span>
                  <span>›</span>
                </div>

                <h3>{program.title}</h3>

                <strong>{program.grades}</strong>

                <p>{program.description}</p>

                <Link href="/academics" className="text-link">
                  Explore Program →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Norse One */}
      <section className="norse-section">
        <div className="container norse-grid">
          <div className="norse-mark">
            <div className="norse-circle">
              <span>N</span>
            </div>
          </div>

          <div>
            <span className="section-label gold-label">THE DIGITAL CAMPUS</span>

            <h2>
              Meet <span>Norse One.</span>
            </h2>

            <p>
              One integrated learning and admissions platform connecting
              families, students, instructors, and academy administration in a
              single secure environment.
            </p>

            <div className="norse-features">
              <span>Admissions</span>
              <span>Learning</span>
              <span>Curriculum</span>
              <span>Assignments</span>
              <span>Grades</span>
              <span>Progress</span>
            </div>

            <Link href="/norse-one" className="button button-gold">
              Explore Norse One
            </Link>
          </div>
        </div>
      </section>

      {/* Life Skills */}
      <section className="section section-white">
        <div className="container life-skills">
          <div className="life-skills-heading">
            <span className="section-label">BEYOND THE CLASSROOM</span>
            <h2>
              Education for
              <br />
              <span>real life.</span>
            </h2>
          </div>

          <div className="life-skills-list">
            <div>
              <strong>01</strong>
              <span>Financial Literacy</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Technology & Digital Citizenship</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Communication & Public Speaking</span>
            </div>

            <div>
              <strong>04</strong>
              <span>Leadership & Responsibility</span>
            </div>

            <div>
              <strong>05</strong>
              <span>Organization & Time Management</span>
            </div>

            <div>
              <strong>06</strong>
              <span>Problem Solving & Critical Thinking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarship */}
      <section className="scholarship-section">
        <div className="container scholarship-content">
          <span className="section-label gold-label">ACCESS TO TECHNOLOGY</span>

          <h2>
            Every student deserves the
            <br />
            <span>tools to learn.</span>
          </h2>

          <p>
            Eligible students may receive access to technology scholarships
            designed to provide the equipment, software, security
            configuration, and technical resources required for coursework.
          </p>

          <Link href="/scholarships" className="button button-outline">
            Technology Scholarships
          </Link>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="admissions-cta">
        <div className="container admissions-cta-content">
          <div>
            <span className="section-label">BEGIN THE JOURNEY</span>
            <h2>Discover Odin Digital Academy.</h2>
          </div>

          <Link href="/admissions" className="button button-gold">
            Begin Admissions
          </Link>
        </div>
      </section>
    </main>
  );
}