// File introduced 2026-08-17 (fe05ed4).
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

import { prisma } from "@/lib/database/prisma";
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

  const grades = await prisma.gradeRecord.findMany({
    where: { student: { userId: session.user.id } }, include: { course: { include: { semester: true, instructor: { include: { user: true } } } } },
    orderBy: { gradedAt: "desc" },
  });
  const records = grades.map(g => ({
    id: g.id, courseName: g.course.name, currentGrade: g.score.toNumber(), letterGrade: g.letterGrade ?? "—",
    instructorName: g.course.instructor ? [g.course.instructor.user.firstName, g.course.instructor.user.lastName].join(" ") : "Unassigned",
  }));

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
          <span>ASSESSMENTS</span>
          <strong>{records.length}</strong>
          <small>Recorded assessments</small>
        </article>

        <article className="norse-stat-card">
          <span>HIGHEST</span>
          <strong>{highest}%</strong>
          <small>Highest current grade</small>
        </article>

        <article className="norse-stat-card">
          <span>SEMESTER</span>
          <strong>{[...new Set(grades.map(g => g.course.semester.name))].join(", ") || "—"}</strong>
          <small>Terms represented</small>
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