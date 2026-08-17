import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

import { mockCourses } from "@/lib/data/mock/courses";
import { mockStudents } from "@/lib/data/mock/students";
import { mockAssignments } from "@/lib/data/mock/assignments";

import type { NorseOneRole } from "@/types/norse-one";

function formatAcademicLevel(level: string) {
  return level
    .replace("GRADE_", "Grade ")
    .replace("PRE_K_", "Pre-K ");
}

function getProgressLabel(progress: number) {
  if (progress >= 90) {
    return "Excellent progress";
  }

  if (progress >= 75) {
    return "On track";
  }

  if (progress >= 60) {
    return "Needs attention";
  }

  return "Getting started";
}

export default async function NorseOneLearningPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role as NorseOneRole;

  const student =
    mockStudents.find(
      (candidate) =>
        candidate.userId === session.user.id
    ) ?? mockStudents[0];

  const courses = mockCourses.filter(
    (course) =>
      course.active &&
      course.academicLevel === student.academicLevel
  );

  const assignments = mockAssignments.filter(
    (assignment) =>
      assignment.studentId === student.id
  );

  const nextAssignment =
    assignments
      .filter(
        (assignment) =>
          assignment.status !== "SUBMITTED" &&
          assignment.status !== "GRADED"
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      )[0];

  const averageProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce(
            (total, course) =>
              total + course.progress,
            0
          ) / courses.length
        )
      : 0;

  const completedCourses = courses.filter(
    (course) =>
      course.progress >= 100
  ).length;

  const activeAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status !== "SUBMITTED" &&
        assignment.status !== "GRADED"
    ).length;

  const totalAssignments =
    assignments.length;

  const completedAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status === "SUBMITTED" ||
        assignment.status === "GRADED"
    ).length;

  return (
    <NorseOneShell role={role}>
      <section className="norse-page-heading">
        <span>STUDENT LEARNING</span>

        <h1>My Learning</h1>

        <p>
          Welcome back, {student.firstName}. Continue
          your academic journey from one connected
          learning workspace.
        </p>
      </section>

      <section className="norse-stat-grid">
        <article className="norse-stat-card">
          <span>ACTIVE COURSES</span>

          <strong>{courses.length}</strong>

          <small>
            {formatAcademicLevel(
              student.academicLevel
            )}
          </small>
        </article>

        <article className="norse-stat-card">
          <span>AVERAGE PROGRESS</span>

          <strong>
            {averageProgress}%
          </strong>

          <small>
            Across current coursework
          </small>
        </article>

        <article className="norse-stat-card">
          <span>ASSIGNMENTS</span>

          <strong>
            {completedAssignments}/
            {totalAssignments}
          </strong>

          <small>
            Completed assignments
          </small>
        </article>

        <article className="norse-stat-card">
          <span>REMAINING WORK</span>

          <strong>
            {activeAssignments}
          </strong>

          <small>
            Assignments requiring attention
          </small>
        </article>
      </section>

      {nextAssignment && (
        <section className="norse-learning-focus">
          <div>
            <span>CONTINUE LEARNING</span>

            <h2>
              {nextAssignment.title}
            </h2>

            <p>
              {nextAssignment.courseName}
              {" — "}
              {nextAssignment.description}
            </p>

            <div className="norse-learning-focus-meta">
              <span>
                Due {nextAssignment.dueDate}
              </span>

              <span>
                {nextAssignment.pointsPossible} points
              </span>

              <span>
                {nextAssignment.status
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (character) =>
                    character.toUpperCase()
                  )}
              </span>
            </div>
          </div>

          <Link
            href="/norse-one/assignments"
            className="button button-gold"
          >
            View Assignments
          </Link>
        </section>
      )}

      <section className="norse-section-heading">
        <div>
          <span>MY COURSES</span>

          <h2>Current Learning</h2>
        </div>

        <Link
          href="/norse-one/curriculum"
          className="norse-text-link"
        >
          View Curriculum
        </Link>
      </section>

      <section className="norse-learning-grid">
        {courses.map((course, index) => (
          <article
            className="norse-learning-card"
            key={course.id}
          >
            <div className="norse-learning-card-top">
              <span>
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              <small>
                {getProgressLabel(
                  course.progress
                )}
              </small>
            </div>

            <span className="norse-learning-subject">
              {course.subject}
            </span>

            <h3>{course.name}</h3>

            <p>
              Instructor:{" "}
              {course.instructorName}
            </p>

            <div className="norse-learning-progress">
              <div>
                <span>COURSE PROGRESS</span>

                <strong>
                  {course.progress}%
                </strong>
              </div>

              <div className="norse-progress-track">
                <span
                  style={{
                    width: `${course.progress}%`,
                  }}
                />
              </div>
            </div>

            <Link
              href="/norse-one/curriculum"
              className="norse-learning-card-link"
            >
              Open Course
              <span aria-hidden="true">
                →
              </span>
            </Link>
          </article>
        ))}
      </section>

      <section className="norse-learning-overview">
        <div>
          <span>ACADEMIC MOMENTUM</span>

          <h2>
            Keep moving forward.
          </h2>

          <p>
            Your learning workspace brings together
            courses, assignments, curriculum,
            grades, and academic progress so you
            always know what comes next.
          </p>
        </div>

        <div className="norse-learning-overview-stats">
          <div>
            <strong>
              {student.currentGpa?.toFixed(1) ??
                "—"}
            </strong>

            <span>Current GPA</span>
          </div>

          <div>
            <strong>
              {student.attendanceRate ?? 0}%
            </strong>

            <span>Attendance</span>
          </div>

          <div>
            <strong>
              {completedCourses}/
              {courses.length}
            </strong>

            <span>Courses Complete</span>
          </div>
        </div>
      </section>
    </NorseOneShell>
  );
}