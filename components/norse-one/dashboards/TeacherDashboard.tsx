import Link from "next/link";

export default function TeacherDashboard() {
  return (
    <>
      <section className="norse-dashboard-header">
        <div>
          <span className="norse-eyebrow">
            STAFF WORKSPACE
          </span>

          <h1>
            Welcome,
            <span> Ms. Raven.</span>
          </h1>

          <p>
            Manage classes, student progress,
            assignments, grading, and communication.
          </p>
        </div>

        <div className="norse-academic-badge">
          <span>ROLE</span>
          <strong>Teacher</strong>
          <small>Academic Staff</small>
        </div>
      </section>

      <section className="norse-stat-grid">
        <article className="norse-stat-card">
          <span>STUDENTS</span>
          <strong>24</strong>
          <small>Assigned students</small>
        </article>

        <article className="norse-stat-card">
          <span>COURSES</span>
          <strong>4</strong>
          <small>Active courses</small>
        </article>

        <article className="norse-stat-card">
          <span>TO GRADE</span>
          <strong>11</strong>
          <small>Pending submissions</small>
        </article>

        <article className="norse-stat-card">
          <span>MESSAGES</span>
          <strong>6</strong>
          <small>Unread communications</small>
        </article>
      </section>

      <section className="norse-dashboard-grid">
        <div className="norse-dashboard-panel">
          <div className="norse-panel-header">
            <div>
              <span>INSTRUCTOR ACTIONS</span>
              <h2>Teaching Center</h2>
            </div>
          </div>

          <div className="norse-curriculum-grid">
            <Link
              href="/norse-one/assignments"
              className="norse-curriculum-card"
            >
              <span>01</span>
              <strong>Assignments</strong>
              <small>Review & manage →</small>
            </Link>

            <Link
              href="/norse-one/grades"
              className="norse-curriculum-card"
            >
              <span>02</span>
              <strong>Grading</strong>
              <small>Grade submissions →</small>
            </Link>

            <Link
              href="/norse-one/curriculum"
              className="norse-curriculum-card"
            >
              <span>03</span>
              <strong>Curriculum</strong>
              <small>Manage learning →</small>
            </Link>

            <Link
              href="/norse-one/messages"
              className="norse-curriculum-card"
            >
              <span>04</span>
              <strong>Messages</strong>
              <small>Contact families →</small>
            </Link>
          </div>
        </div>

        <div className="norse-dashboard-panel">
          <div className="norse-panel-header">
            <div>
              <span>ATTENTION</span>
              <h2>Student Support</h2>
            </div>
          </div>

          <div className="assignment-list">
            <article className="dashboard-assignment">
              <div>
                <span>ACADEMIC</span>
                <strong>3 students need review</strong>
              </div>

              <small>Today</small>
            </article>

            <article className="dashboard-assignment">
              <div>
                <span>GRADING</span>
                <strong>11 assignments pending</strong>
              </div>

              <small>This week</small>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}