import { redirect } from "next/navigation";

import { auth } from "@/auth";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

import { mockCourses } from "@/lib/data/mock/courses";
import { mockStudents } from "@/lib/data/mock/students";
import type { NorseOneRole } from "@/types/norse-one";

export default async function CurriculumPage() {
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
    (course) => course.active
  );

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

  return (
    <NorseOneShell role={role}>
      <section className="norse-page-heading">
        <span>
          {student?.academicLevel?.replace(
            "_",
            " "
          ) ?? "ACADEMIC PROGRAM"}
        </span>

        <h1>Curriculum</h1>

        <p>
          Your academic roadmap for the current
          preparatory year.
        </p>
      </section>

      <section className="norse-stat-grid">
        <article className="norse-stat-card">
          <span>ACTIVE COURSES</span>

          <strong>{courses.length}</strong>

          <small>
            Current academic program
          </small>
        </article>

        <article className="norse-stat-card">
          <span>AVERAGE PROGRESS</span>

          <strong>{averageProgress}%</strong>

          <small>
            Across active coursework
          </small>
        </article>

        <article className="norse-stat-card">
          <span>SEMESTER</span>

          <strong>FALL</strong>

          <small>
            Current academic term
          </small>
        </article>

        <article className="norse-stat-card">
          <span>ACADEMIC LEVEL</span>

          <strong>
            {student?.academicLevel
              ?.replace("GRADE_", "G")
              .replace("_", " ") ?? "G5"}
          </strong>

          <small>
            Current placement
          </small>
        </article>
      </section>

      <section className="norse-curriculum-grid">
        {courses.map((course, index) => (
          <article
            className="norse-curriculum-card"
            key={course.id}
          >
            <span>
              {String(index + 1).padStart(
                2,
                "0"
              )}
            </span>

            <small>{course.subject}</small>

            <strong>{course.name}</strong>

            <p>
              Instructor: {course.instructorName}
            </p>

            <div className="norse-curriculum-progress">
              <span
                style={{
                  width: `${course.progress}%`,
                }}
              />
            </div>

            <small>
              {course.progress}% complete
            </small>
          </article>
        ))}
      </section>
    </NorseOneShell>
  );
}