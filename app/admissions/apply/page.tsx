export default function ApplyPage() {
  return (
    <main className="public-page">
      <section className="page-hero">
        <div className="container page-hero-content">
          <span className="section-label">ADMISSIONS APPLICATION</span>
          <h1>
            Start your family's
            <span> application.</span>
          </h1>
          <p>
            This application will become the foundation of your family's
            admissions and enrollment record.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container application-layout">
          <aside className="application-sidebar">
            <span>APPLICATION</span>
            <strong>01</strong>
            <p>Family Information</p>
            <p>Student Information</p>
            <p>Academic History</p>
            <p>Documents</p>
            <p>Review & Submit</p>
          </aside>

          <div className="application-card">
            <span className="section-label">FAMILY INFORMATION</span>
            <h2>Create your family account.</h2>

            <form className="academy-form">
              <div className="form-row">
                <label>
                  Parent / Guardian First Name
                  <input type="text" name="firstName" />
                </label>

                <label>
                  Parent / Guardian Last Name
                  <input type="text" name="lastName" />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Email Address
                  <input type="email" name="email" />
                </label>

                <label>
                  Phone Number
                  <input type="tel" name="phone" />
                </label>
              </div>

              <label>
                Number of Parents / Guardians
                <select name="guardians">
                  <option value="">Select</option>
                  <option value="1">1 Parent / Guardian</option>
                  <option value="2">2 Parents / Guardians</option>
                </select>
              </label>

              <div className="form-notice">
                <strong>Application Notice</strong>
                <p>
                  This demonstration form establishes the interface for the
                  future admissions workflow. Production enrollment will use
                  secure server-side validation and document processing.
                </p>
              </div>

              <button type="submit" className="button button-gold">
                Continue Application
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}