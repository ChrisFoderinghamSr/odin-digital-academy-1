import Link from "next/link";

import {
  getStudentAssignments,
  getStudentCourses,
  getStudentByUserId,
} from "@/lib/services/norse-one/student-service";

interface StudentDashboardProps {
  userId: string;
}

function formatAcademicLevel(
  academicLevel: string
): string {
  const labels: Record<string, string> = {
    TODDLER: "Toddler",
    PRE_K_4: "Pre-K 4",
    PRE_K_5: "Pre-K 5",
    KINDERGARTEN: "Kindergarten",
    GRADE_1: "Grade 1",
    GRADE_2: "Grade 2",
    GRADE_3: "Grade 3",
    GRADE_4: "Grade 4",
    GRADE_5: "Grade 5",
  };

  return labels[academicLevel] ?? academicLevel;
}

export default function StudentDashboard({
  userId,
}: StudentDashboardProps) {
  const student = getStudentByUserId(userId);

  if (!student) {
    return (
      <section className="norse-page-heading">
        <span>STUDENT RECORD</span>

        <h1>Student record unavailable.</h1>

        <p>
          Your authenticated account is not currently
          connected to a student record.
        </p>
      </section>
    );
  }

  const courses = getStudentCourses(student.id);

  const assignments =
    getStudentAssignments(student.id);

  const academicLevel = formatAcademicLevel(
    student.academicLevel
  );

  return (
    <>
      <section className="norse-dashboard-header">
        <div>
          <span className="norse-eyebrow">
            GOOD MORNING
          </span>

          <h1>
            Welcome back,
            <span> {student.firstName}.</span>
          </h1>

          <p>
            Here&apos;s what&apos;s happening with your
            learning journey today.
          </p>
        </div>

        <div className="norse-academic-badge">
          <span>ACADEMIC LEVEL</span>

          <strong>{academicLevel}</strong>

          <small>
            Odin Digital Academy
          </small>
        </div>
      </section>

      <section className="norse-stat-grid">
        <article className="norse-stat-card">
          <span>COURSES</span>

          <strong>{courses.length}</strong>

          <small>Active courses</small>
        </article>

        <article className="norse-stat-card">
          <span>ASSIGNMENTS</span>

          <strong>{assignments.length}</strong>

          <small>Current assignments</small>
        </article>

        <article className="norse-stat-card">
          <span>GPA</span>

          <strong>
            {student.currentGpa ?? "N/A"}
          </strong>

          <small>
            Current academic GPA
          </small>
        </article>

        <article className="norse-stat-card">
          <span>ATTENDANCE</span>

          <strong>
            {student.attendanceRate ?? 0}%
          </strong>

          <small>
            Current attendance
          </small>
        </article>
      </section>

      <section className="norse-dashboard-grid">
        <div className="norse-dashboard-panel">
          <div className="norse-panel-header">
            <div>
              <span>ACADEMIC PROGRESS</span>

              <h2>My Learning</h2>
            </div>

            <Link href="/norse-one/learning">
              View All
            </Link>
          </div>

          <div className="course-list">
            {courses.map((course) => (
              <article
                className="course-row"
                key={course.id}
              >
                <div className="course-icon">
                  {course.subject.charAt(0)}
                </div>

                <div className="course-information">
                  <span>
                    {course.subject}
                  </span>

                  <strong>
                    {course.name}
                  </strong>

                  <small>
                    {course.instructorName}
                  </small>
                </div>

                <div className="course-progress">
                  <div className="progress-track">
                    <div
                      className="progress-value"
                      style={{
                        width: `${course.progress}%`,
                      }}
                    />
                  </div>

                  <strong>
                    {course.progress}%
                  </strong>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="norse-dashboard-panel">
          <div className="norse-panel-header">
            <div>
              <span>UPCOMING WORK</span>

              <h2>Assignments</h2>
            </div>

            <Link href="/norse-one/assignments">
              View All
            </Link>
          </div>

          <div className="assignment-list">
            {assignments.map((assignment) => (
              <article
                className="dashboard-assignment"
                key={assignment.id}
              >
                <div>
                  <span>
                    {assignment.courseName}
                  </span>

                  <strong>
                    {assignment.title}
                  </strong>
                </div>

                <small>
                  {assignment.status
                    .replaceAll("_", " ")}
                </small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="norse-dashboard-banner">
        <div>
          <span>NORSE ONE</span>

          <h2>
            Every lesson is part of the journey.
          </h2>

          <p>
            Learn. Practice. Apply. Reflect. Grow.
          </p>
        </div>

        <Link
          href="/norse-one/curriculum"
          className="button button-gold"
        >
          View Curriculum
        </Link>
      </section>
    </>
  );
}