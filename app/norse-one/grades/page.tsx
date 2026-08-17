import { redirect } from "next/navigation";

import { auth } from "@/auth";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

import { mockGrades } from "@/lib/data/mock/grades";
import { mockStudents } from "@/lib/data/mock/students";
import type { NorseOneRole } from "@/types/norse-one";

function getGradeClass(letterGrade: string) {
  if (letterGrade.startsWith("A")) {
    return "grade-excellent";
  }

  if (letterGrade.startsWith("B")) {
    return "grade-good";
  }

  if (letterGrade.startsWith("C")) {
    return "grade-watch";
  }

  return "grade-attention";
}

export default async function GradesPage() {
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

  const grades = mockGrades.filter(
    (grade) =>
      grade.studentId === student?.id
  );

  const records = grades.length
    ? grades
    : mockGrades;

  const average =
    records.length > 0
      ? Math.round(
          records.reduce(
            (total, grade) =>
              total + grade.currentGrade,
            0
          ) / records.length
        )
      : 0;

  const highest =
    records.length > 0
      ? Math.max(
          ...records.map(
            (grade) => grade.currentGrade
          )
        )
      : 0;

  return (
    <NorseOneShell role={role}>
      <section className="norse-page-heading">
        <span>ACADEMIC PERFORMANCE</span>

        <h1>Grades</h1>

        <p>
          Track academic performance and instructor
          evaluations.
        </p>
      </section>

      <section className="norse-stat-grid">
        <article className="norse-stat-card">
          <span>ACADEMIC AVERAGE</span>
          <strong>{average}%</strong>
          <small>Current course average</small>
        </article>

        <article className="norse-stat-card">
          <span>COURSES</span>
          <strong>{records.length}</strong>
          <small>Active graded courses</small>
        </article>

        <article className="norse-stat-card">
          <span>HIGHEST</span>
          <strong>{highest}%</strong>
          <small>Highest current grade</small>
        </article>

        <article className="norse-stat-card">
          <span>SEMESTER</span>
          <strong>FALL</strong>
          <small>Current academic term</small>
        </article>
      </section>

      <section className="norse-grade-grid">
        {records.map((grade) => (
          <article
            className={`norse-grade-card ${getGradeClass(
              grade.letterGrade
            )}`}
            key={grade.id}
          >
            <div className="norse-grade-card-header">
              <span>{grade.courseName}</span>

              <b>{grade.letterGrade}</b>
            </div>

            <strong>
              {grade.currentGrade}%
            </strong>

            <small>
              Instructor: {grade.instructorName}
            </small>

            <div className="norse-grade-progress">
              <span
                style={{
                  width: `${grade.currentGrade}%`,
                }}
              />
            </div>
          </article>
        ))}
      </section>
    </NorseOneShell>
  );
}