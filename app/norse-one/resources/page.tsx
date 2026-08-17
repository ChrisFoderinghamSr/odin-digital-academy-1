export default function NorseOneResourcesPage() {
  return (
    <main className="public-page">
      <section className="page-hero compact-page-hero">
        <div className="container page-hero-content">
          <span className="section-label">NORSE ONE RESOURCES</span>
          <h1>
            Everything families need
            <span> to stay connected.</span>
          </h1>
          <p>
            Parent guides, handouts, newsletters, curriculum resources,
            technology resources, and academic support.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container resource-grid">
          <article className="resource-card">
            <span>01</span>
            <h3>Parent Guides</h3>
            <p>Unit-specific guidance for supporting learning at home.</p>
          </article>

          <article className="resource-card">
            <span>02</span>
            <h3>Handouts</h3>
            <p>Downloadable academic resources connected to coursework.</p>
          </article>

          <article className="resource-card">
            <span>03</span>
            <h3>Newsletters</h3>
            <p>Academy updates, upcoming events, and family information.</p>
          </article>

          <article className="resource-card">
            <span>04</span>
            <h3>Technology Support</h3>
            <p>Setup guides and technical resources for student devices.</p>
          </article>
        </div>
      </section>
    </main>
  );
}