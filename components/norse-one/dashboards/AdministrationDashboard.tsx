import Link from "next/link";

export default function AdministrationDashboard() {
  return (
    <>
      <section className="norse-dashboard-header">
        <div>
          <span className="norse-eyebrow">
            ACADEMY ADMINISTRATION
          </span>

          <h1>
            Administration
            <span> Center.</span>
          </h1>

          <p>
            Manage admissions, enrollment, people,
            curriculum, scholarships, technology, and
            system operations.
          </p>
        </div>

        <div className="norse-academic-badge">
          <span>SECURITY LEVEL</span>
          <strong>Privileged</strong>
          <small>Administrative access</small>
        </div>
      </section>

      <section className="norse-stat-grid">
        <article className="norse-stat-card">
          <span>STUDENTS</span>
          <strong>248</strong>
          <small>Active enrollment</small>
        </article>

        <article className="norse-stat-card">
          <span>APPLICATIONS</span>
          <strong>41</strong>
          <small>Current applicants</small>
        </article>

        <article className="norse-stat-card">
          <span>STAFF</span>
          <strong>32</strong>
          <small>Active employees</small>
        </article>

        <article className="norse-stat-card">
          <span>COURSES</span>
          <strong>116</strong>
          <small>Active curriculum</small>
        </article>
      </section>

      <section className="norse-dashboard-panel">
        <div className="norse-panel-header">
          <div>
            <span>ADMINISTRATION</span>
            <h2>Academy Operations</h2>
          </div>
        </div>

        <div className="norse-curriculum-grid">
          <Link
            href="/norse-one/admissions"
            className="norse-curriculum-card"
          >
            <span>01</span>
            <strong>Admissions</strong>
            <small>Review applicants →</small>
          </Link>

          <Link
            href="/norse-one/enrollment"
            className="norse-curriculum-card"
          >
            <span>02</span>
            <strong>Enrollment</strong>
            <small>Manage enrollment →</small>
          </Link>

          <Link
            href="/norse-one/curriculum"
            className="norse-curriculum-card"
          >
            <span>03</span>
            <strong>Curriculum</strong>
            <small>Manage academics →</small>
          </Link>

          <Link
            href="/norse-one/messages"
            className="norse-curriculum-card"
          >
            <span>04</span>
            <strong>Communications</strong>
            <small>Academy messages →</small>
          </Link>
        </div>
      </section>
    </>
  );
}