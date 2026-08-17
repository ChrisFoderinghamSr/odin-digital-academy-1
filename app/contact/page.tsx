export default function ContactPage() {
  return (
    <main className="public-page">
      <section className="page-hero compact-page-hero">
        <div className="container page-hero-content">
          <span className="section-label">CONTACT</span>
          <h1>
            Connect with
            <span> Odin Academy.</span>
          </h1>
          <p>
            Questions about admissions, academics, technology, or Norse One?
            We're building a connected support experience for every family.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container contact-layout">
          <div>
            <span className="section-label">CONTACT THE ACADEMY</span>
            <h2>
              We're here to
              <span> help.</span>
            </h2>

            <p className="contact-copy">
              Use the form to send an inquiry. Production communications will
              be routed through the academy's secure support system.
            </p>
          </div>

          <div className="application-card">
            <form className="academy-form">
              <label>
                Name
                <input type="text" name="name" />
              </label>

              <label>
                Email
                <input type="email" name="email" />
              </label>

              <label>
                Inquiry Type
                <select name="type">
                  <option value="">Select</option>
                  <option value="admissions">Admissions</option>
                  <option value="academics">Academics</option>
                  <option value="norse-one">Norse One</option>
                  <option value="technology">Technology Support</option>
                  <option value="general">General Question</option>
                </select>
              </label>

              <label>
                Message
                <textarea name="message" rows={6} />
              </label>

              <button type="submit" className="button button-gold">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}