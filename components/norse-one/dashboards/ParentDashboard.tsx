import Link from "next/link";

import {
  getFamilyParents,
  getFamilyStudents,
} from "@/lib/services/norse-one/family-service";

const FAMILY_ID = "family-001";

export default function ParentDashboard() {
  const students = getFamilyStudents(FAMILY_ID);
  const parents = getFamilyParents(FAMILY_ID);

  const student = students[0];
  const primaryParent = parents.find(
    ({ guardian }) => guardian.primary
  );

  return (
    <>
      <section className="norse-dashboard-header">
        <div>
          <span className="norse-eyebrow">
            FAMILY WORKSPACE
          </span>

          <h1>
            Welcome,
            <span>
              {" "}
              {primaryParent?.user?.firstName ??
                "Parent"}
              .
            </span>
          </h1>

          <p>
            Monitor your student&apos;s academic journey,
            assignments, attendance, and school communications.
          </p>
        </div>

        <div className="norse-academic-badge">
          <span>FAMILY ACCOUNT</span>
          <strong>Active</strong>
          <small>
            {students.length} enrolled student
          </small>
        </div>
      </section>

      <section className="family-profile-grid">
        {students.map((familyStudent) => (
          <article
            className="family-profile-card student-profile"
            key={familyStudent.id}
          >
            <span>STUDENT</span>

            <h2>
              {familyStudent.firstName}{" "}
              {familyStudent.lastName}
            </h2>

            <p>
              Grade 5 • Preparatory Academy
            </p>

            <strong>
              Enrollment:{" "}
              {familyStudent.enrollmentStatus}
            </strong>
          </article>
        ))}
      </section>

      <section className="norse-stat-grid family-dashboard-stats">
        <article className="norse-stat-card">
          <span>ACADEMIC GPA</span>
          <strong>
            {student?.currentGpa ?? "N/A"}
          </strong>
          <small>Current standing</small>
        </article>

        <article className="norse-stat-card">
          <span>ATTENDANCE</span>
          <strong>
            {student?.attendanceRate ?? 0}%
          </strong>
          <small>Current attendance</small>
        </article>

        <article className="norse-stat-card">
          <span>MESSAGES</span>
          <strong>2</strong>
          <small>Unread communications</small>
        </article>

        <article className="norse-stat-card">
          <span>DOCUMENTS</span>
          <strong>7</strong>
          <small>Family records</small>
        </article>
      </section>

      <section className="norse-dashboard-banner">
        <div>
          <span>FAMILY SERVICES</span>

          <h2>
            Stay connected to your child&apos;s
            education.
          </h2>

          <p>
            Review learning progress, enrollment,
            assignments, and Academy communication.
          </p>
        </div>

        <Link
          href="/norse-one/family"
          className="button button-gold"
        >
          Family Workspace
        </Link>
      </section>
    </>
  );
}