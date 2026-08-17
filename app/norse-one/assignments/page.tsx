import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

import {
  getStudentAssignments,
  getStudentByUserId,
} from "@/lib/services/norse-one/student-service";

import type {
  AssignmentStatus,
  NorseOneRole,
} from "@/types/norse-one";

function formatStatus(
  status: AssignmentStatus
): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function getStatusClass(
  status: AssignmentStatus
): string {
  return `assignment-status ${status
    .toLowerCase()
    .replace(/_/g, "-")}`;
}

function formatDueDate(
  date: string
): string {
  const dueDate = new Date(
    `${date}T12:00:00`
  );

  const today = new Date();

  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const dueStart = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate()
  );

  const difference = Math.round(
    (dueStart.getTime() -
      todayStart.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (difference < 0) {
    return "Past Due";
  }

  if (difference === 0) {
    return "Today";
  }

  if (difference === 1) {
    return "Tomorrow";
  }

  return dueDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}

export default async function AssignmentsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role =
    session.user.role as NorseOneRole;

  if (role !== "STUDENT") {
    redirect("/norse-one/dashboard");
  }

  const student =
    getStudentByUserId(
      session.user.id
    );

  if (!student) {
    return (
      <NorseOneShell role={role}>
        <section className="norse-page-heading">
          <span>STUDENT RECORD</span>

          <h1>
            Assignment record unavailable.
          </h1>

          <p>
            Your authenticated account is not
            currently connected to a student
            academic record.
          </p>
        </section>
      </NorseOneShell>
    );
  }

  const assignments =
    getStudentAssignments(student.id);

  const submitted =
    assignments.filter(
      (assignment) =>
        assignment.status ===
          "SUBMITTED" ||
        assignment.status === "GRADED" ||
        assignment.status === "RETURNED"
    ).length;

  const inProgress =
    assignments.filter(
      (assignment) =>
        assignment.status ===
        "IN_PROGRESS"
    ).length;

  const notStarted =
    assignments.filter(
      (assignment) =>
        assignment.status ===
        "NOT_STARTED"
    ).length;

  return (
    <NorseOneShell role={role}>
      <section className="norse-page-heading">
        <span>ACADEMIC WORK</span>

        <h1>Assignments</h1>

        <p>
          Review, complete, submit, and track
          your coursework.
        </p>
      </section>

      <section className="norse-stat-grid">
        <article className="norse-stat-card">
          <span>TOTAL</span>

          <strong>
            {assignments.length}
          </strong>

          <small>
            Current assignments
          </small>
        </article>

        <article className="norse-stat-card">
          <span>IN PROGRESS</span>

          <strong>
            {inProgress}
          </strong>

          <small>
            Work currently underway
          </small>
        </article>

        <article className="norse-stat-card">
          <span>SUBMITTED</span>

          <strong>
            {submitted}
          </strong>

          <small>
            Completed submissions
          </small>
        </article>

        <article className="norse-stat-card">
          <span>NOT STARTED</span>

          <strong>
            {notStarted}
          </strong>

          <small>
            Awaiting student action
          </small>
        </article>
      </section>

      <section className="norse-table-panel">
        <div className="norse-table-header">
          <div>
            <strong>
              Current Assignments
            </strong>

            <span>
              {student.firstName}{" "}
              {student.lastName}
            </span>
          </div>

          <span>
            {assignments.length} items
          </span>
        </div>

        {assignments.length === 0 && (
          <div className="norse-empty-state">
            <span>ACADEMIC WORK</span>

            <h2>
              No assignments available.
            </h2>

            <p>
              Your current coursework does not
              contain any assignments yet.
            </p>
          </div>
        )}

        {assignments.map(
          (assignment) => (
            <article
              className="norse-table-row"
              key={assignment.id}
            >
              <div>
                <span>
                  {assignment.courseName}
                </span>

                <strong>
                  {assignment.title}
                </strong>

                <small>
                  {assignment.description}
                </small>
              </div>

              <div>
                <span>DUE</span>

                <strong>
                  {formatDueDate(
                    assignment.dueDate
                  )}
                </strong>
              </div>

              <div>
                <span>POINTS</span>

                <strong>
                  {assignment.pointsEarned !==
                  undefined
                    ? `${assignment.pointsEarned}/${assignment.pointsPossible}`
                    : assignment.pointsPossible}
                </strong>
              </div>

              <b
                className={getStatusClass(
                  assignment.status
                )}
              >
                {formatStatus(
                  assignment.status
                )}
              </b>

              <Link
                href={`/norse-one/assignments/${assignment.id}`}
                className="norse-assignment-link"
              >
                View
              </Link>
            </article>
          )
        )}
      </section>
    </NorseOneShell>
  );
}