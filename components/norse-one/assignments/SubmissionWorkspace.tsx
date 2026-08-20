"use client";

import { useEffect, useState } from "react";

interface SubmissionWorkspaceProps {
  assignmentId: string;
  initialStatus: string;
}

interface SubmissionResponse {
  submission: {
    id: string;
    response: string | null;
    status: string;
    submittedAt: string | null;
    feedback: string | null;
    grade: number | null;
    pointsEarned: number | null;
    pointsPossible: number | null;
  } | null;
}

function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

export default function SubmissionWorkspace({
  assignmentId,
  initialStatus,
}: SubmissionWorkspaceProps) {
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [feedback, setFeedback] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isSubmitted =
    status === "SUBMITTED" ||
    status === "GRADED" ||
    status === "RETURNED";

  useEffect(() => {
    let cancelled = false;

    async function loadSubmission() {
      try {
        const response = await fetch(
          `/api/norse-one/assignments/${assignmentId}/submission`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load your submission."
          );
        }

        const data =
          (await response.json()) as SubmissionResponse;

        if (cancelled) {
          return;
        }

        if (data.submission) {
          setResponse(
            data.submission.response ?? ""
          );

          setStatus(data.submission.status);

          setFeedback(
            data.submission.feedback ?? null
          );
        }
      } catch (error) {
        if (!cancelled) {
          setFeedback(
            error instanceof Error
              ? error.message
              : "Unable to load your submission."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSubmission();

    return () => {
      cancelled = true;
    };
  }, [assignmentId]);

  async function saveSubmission(
    action: "SAVE_DRAFT" | "SUBMIT"
  ) {
    if (!response.trim()) {
      setFeedback(
        "Please enter your response before saving or submitting."
      );

      return;
    }

    if (action === "SAVE_DRAFT") {
      setSaving(true);
    } else {
      setSubmitting(true);
    }

    setFeedback(null);

    try {
      const result = await fetch(
        `/api/norse-one/assignments/${assignmentId}/submission`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            response: response.trim(),
          }),
        }
      );

      const data =
        (await result.json()) as
          | SubmissionResponse
          | { error?: string };

      if (!result.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Unable to save your submission."
        );
      }

      if (
        "submission" in data &&
        data.submission
      ) {
        setStatus(data.submission.status);

        setResponse(
          data.submission.response ?? ""
        );

        setFeedback(
          action === "SUBMIT"
            ? "Your assignment has been submitted successfully."
            : "Your draft has been saved."
        );
      }
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to save your submission."
      );
    } finally {
      setSaving(false);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="norse-submission-panel">
        <div>
          <span>SUBMISSION</span>

          <h2>
            Loading your workspace...
          </h2>

          <p>
            NORSE ONE is retrieving your saved
            submission.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="norse-submission-panel">
      <div className="norse-submission-workspace">
        <div className="norse-panel-header">
          <div>
            <span>SUBMISSION WORKSPACE</span>

            <h2>
              {isSubmitted
                ? "Your submitted response"
                : "Your Response"}
            </h2>
          </div>

          <span
            className={`assignment-status ${status
              .toLowerCase()
              .replace(/_/g, "-")}`}
          >
            {formatStatus(status)}
          </span>
        </div>

        <p className="norse-submission-instructions">
          Write your response below. Save a draft
          whenever you need to return later. Once
          submitted, your response will be sent to
          your instructor for review.
        </p>

        <label
          htmlFor={`submission-${assignmentId}`}
          className="norse-submission-label"
        >
          RESPONSE
        </label>

        <textarea
          id={`submission-${assignmentId}`}
          className="norse-submission-textarea"
          value={response}
          onChange={(event) =>
            setResponse(event.target.value)
          }
          placeholder="Enter your assignment response here..."
          disabled={
            isSubmitted ||
            saving ||
            submitting
          }
          rows={14}
        />

        <div className="norse-submission-footer">
          <span>
            {response.length} characters
          </span>

          {!isSubmitted && (
            <div className="norse-submission-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={() =>
                  void saveSubmission(
                    "SAVE_DRAFT"
                  )
                }
                disabled={
                  saving ||
                  submitting ||
                  !response.trim()
                }
              >
                {saving
                  ? "Saving..."
                  : "Save Draft"}
              </button>

              <button
                type="button"
                className="button button-gold"
                onClick={() =>
                  void saveSubmission(
                    "SUBMIT"
                  )
                }
                disabled={
                  saving ||
                  submitting ||
                  !response.trim()
                }
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Assignment"}
              </button>
            </div>
          )}
        </div>

        {feedback && (
          <div
            className="norse-submission-feedback"
            role="status"
          >
            {feedback}
          </div>
        )}
      </div>
    </section>
  );
}