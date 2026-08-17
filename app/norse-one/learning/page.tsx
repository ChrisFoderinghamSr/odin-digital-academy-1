export default function NorseOneLearningPage() {
  return (
    <main className="public-page">
      <section className="page-hero">
        <div className="container page-hero-content">
          <span className="section-label">NORSE ONE</span>

          <h1>
            The learning
            <span> environment.</span>
          </h1>

          <p>
            Students move through lessons, assignments, projects, assessments,
            and progress tracking through one connected workspace.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container learning-preview">
          <div className="learning-dashboard-card">
            <span className="section-label">STUDENT LEARNING</span>

            <h2>Today&apos;s Learning</h2>

            <div className="learning-row">
              <span>01</span>
              <strong>Mathematics</strong>
              <small>Multiplication Strategies</small>
            </div>

            <div className="learning-row">
              <span>02</span>
              <strong>Reading</strong>
              <small>Character &amp; Setting</small>
            </div>

            <div className="learning-row">
              <span>03</span>
              <strong>Science</strong>
              <small>Living Systems</small>
            </div>

            <div className="learning-row">
              <span>04</span>
              <strong>Life Skills</strong>
              <small>Personal Responsibility</small>
            </div>
          </div>

          <div className="learning-copy">
            <span className="section-label">DESIGNED FOR GROWTH</span>

            <h2>
              Learn at the right
              <span> level.</span>
            </h2>

            <p>
              Norse One will eventually connect age-appropriate learning
              experiences with student progress, instructor feedback,
              assessments, and family visibility.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}