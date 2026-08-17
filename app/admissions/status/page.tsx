export default function AdmissionsStatusPage() {
  return (
    <main className="public-page">
      <section className="page-hero compact-page-hero">
        <div className="container page-hero-content">
          <span className="section-label">ADMISSIONS PLATFORM</span>
          <h1>
            Check application
            <span> status.</span>
          </h1>
          <p>
            Enter your application information to access your admissions
            status.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container status-container">
          <div className="status-card">
            <span className="section-label">APPLICATION STATUS</span>

            <h2>Find your application.</h2>

            <form className="academy-form">
              <label>
                Application ID
                <input type="text" name="applicationId" />
              </label>

              <label>
                Parent Email
                <input type="email" name="email" />
              </label>

              <button type="submit" className="button button-gold">
                Check Status
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}