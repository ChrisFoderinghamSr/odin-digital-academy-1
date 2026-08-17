import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";

import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

import {
  getStudentAssignmentById,
  getStudentByUserId,
} from "@/lib/services/norse-one/student-service";

import type {
  AssignmentStatus,
  NorseOneRole,
} from "@/types/norse-one";

interface AssignmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

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

function formatDate(
  date: string
): string {
  const formattedDate = new Date(
    `${date}T12:00:00`
  );

  return formattedDate.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatSubmissionDate(
  date?: string
): string {
  if (!date) {
    return "Not submitted";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

export default async function AssignmentDetailPage({
  params,
}: AssignmentPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role =
    session.user.role as NorseOneRole;

  if (role !== "STUDENT") {
    redirect("/norse-one/dashboard");
  }

  const { id } = await params;

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
            Student record unavailable.
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

  const assignment =
    getStudentAssignmentById(
      student.id,
      id
    );

  if (!assignment) {
    notFound();
  }

  const isSubmitted =
    assignment.status === "SUBMITTED" ||
    assignment.status === "GRADED" ||
    assignment.status === "RETURNED";

  const isGraded =
    assignment.status === "GRADED";

  return (
    <NorseOneShell role={role}>
      <section className="norse-assignment-detail-header">
        <div>
          <Link
            href="/norse-one/assignments"
            className="norse-back-link"
          >
            ← Back to Assignments
          </Link>

          <span className="norse-eyebrow">
            {assignment.courseName}
          </span>

          <h1>{assignment.title}</h1>

          <p>
            {assignment.description}
          </p>
        </div>

        <div className="norse-assignment-detail-status">
          <span>STATUS</span>

          <b
            className={getStatusClass(
              assignment.status
            )}
          >
            {formatStatus(
              assignment.status
            )}
          </b>
        </div>
      </section>

      <section className="norse-assignment-meta-grid">
        <article className="norse-stat-card">
          <span>DUE DATE</span>

          <strong>
            {formatDate(
              assignment.dueDate
            )}
          </strong>

          <small>
            Assignment deadline
          </small>
        </article>

        <article className="norse-stat-card">
          <span>POINTS</span>

          <strong>
            {assignment.pointsEarned !==
            undefined
              ? `${assignment.pointsEarned}/${assignment.pointsPossible}`
              : assignment.pointsPossible}
          </strong>

          <small>
            {isGraded
              ? "Points earned"
              : "Points possible"}
          </small>
        </article>

        <article className="norse-stat-card">
          <span>SUBMISSION</span>

          <strong>
            {isSubmitted
              ? "Submitted"
              : "Not Started"}
          </strong>

          <small>
            {formatSubmissionDate(
              assignment.submittedAt
            )}
          </small>
        </article>
      </section>

      <section className="norse-assignment-detail-grid">
        <div className="norse-assignment-main-panel">
          <div className="norse-panel-header">
            <div>
              <span>ASSIGNMENT</span>

              <h2>
                Instructions
              </h2>
            </div>
          </div>

          <div className="norse-assignment-instructions">
            <p>
              {assignment.description}
            </p>

            <div className="norse-assignment-instruction-block">
              <span>COURSE</span>

              <strong>
                {assignment.courseName}
              </strong>
            </div>

            <div className="norse-assignment-instruction-block">
              <span>INSTRUCTOR</span>

              <strong>
                Course Instructor
              </strong>
            </div>

            <div className="norse-assignment-instruction-block">
              <span>POINT VALUE</span>

              <strong>
                {assignment.pointsPossible}{" "}
                points
              </strong>
            </div>
          </div>
        </div>

        <aside className="norse-assignment-side-panel">
          <span>WORKFLOW</span>

          <h2>
            Assignment progress
          </h2>

          <div className="norse-assignment-workflow">
            <div
              className={
                "norse-workflow-step active"
              }
            >
              <span>01</span>

              <div>
                <strong>
                  Assignment Opened
                </strong>

                <small>
                  Review the assignment
                  requirements.
                </small>
              </div>
            </div>

            <div
              className={
                `norse-workflow-step ${
                  isSubmitted
                    ? "active"
                    : ""
                }`
              }
            >
              <span>02</span>

              <div>
                <strong>
                  Submit Work
                </strong>

                <small>
                  Complete and submit your
                  assignment.
                </small>
              </div>
            </div>

            <div
              className={
                `norse-workflow-step ${
                  isGraded
                    ? "active"
                    : ""
                }`
              }
            >
              <span>03</span>

              <div>
                <strong>
                  Instructor Review
                </strong>

                <small>
                  Your instructor reviews
                  the submission.
                </small>
              </div>
            </div>

            <div
              className={
                `norse-workflow-step ${
                  isGraded
                    ? "active"
                    : ""
                }`
              }
            >
              <span>04</span>

              <div>
                <strong>
                  Grade &amp; Feedback
                </strong>

                <small>
                  Review your result and
                  instructor feedback.
                </small>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="norse-submission-panel">
        <div>
          <span>SUBMISSION</span>

          <h2>
            {isSubmitted
              ? "Your work has been submitted."
              : "Ready to submit your work?"}
          </h2>

          <p>
            {isSubmitted
              ? `Your submission was recorded on ${formatSubmissionDate(
                  assignment.submittedAt
                )}.`
              : "The submission workspace will allow you to enter your work and submit it directly through NORSE ONE."}
          </p>
        </div>

        {!isSubmitted && (
          <button
            type="button"
            className="button button-gold"
            disabled
          >
            Submission Workspace Coming Soon
          </button>
        )}

        {isSubmitted && isGraded && (
          <Link
            href="/norse-one/grades"
            className="button button-gold"
          >
            View Grades
          </Link>
        )}
      </section>
    </NorseOneShell>
  );
}