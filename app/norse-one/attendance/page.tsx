import { redirect } from "next/navigation";

import { auth } from "@/auth";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

import { mockAttendance } from "@/lib/data/mock/attendance";
import { mockStudents } from "@/lib/data/mock/students";
import type {
  AttendanceStatus,
  NorseOneRole,
} from "@/types/norse-one";

function formatStatus(status: AttendanceStatus) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function getStatusClass(
  status: AttendanceStatus
) {
  return `attendance-status ${status.toLowerCase()}`;
}

function formatDate(date: string) {
  return new Date(
    `${date}T12:00:00`
  ).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AttendancePage() {
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

  const records = mockAttendance.filter(
    (record) =>
      record.studentId === student?.id
  );

  const attendance =
    records.length > 0
      ? records
      : mockAttendance;

  const present = attendance.filter(
    (record) => record.status === "PRESENT"
  ).length;

  const absent = attendance.filter(
    (record) => record.status === "ABSENT"
  ).length;

  const excused = attendance.filter(
    (record) => record.status === "EXCUSED"
  ).length;

  const tardy = attendance.filter(
    (record) => record.status === "TARDY"
  ).length;

  return (
    <NorseOneShell role={role}>
      <section className="norse-page-heading">
        <span>STUDENT RECORD</span>

        <h1>Attendance</h1>

        <p>
          Review your current academic attendance
          record.
        </p>
      </section>

      <section className="norse-attendance-card">
        <div>
          <span>ATTENDANCE RATE</span>

          <strong>
            {student?.attendanceRate ?? 0}%
          </strong>
        </div>

        <div>
          <span>PRESENT</span>

          <strong>{present}</strong>
        </div>

        <div>
          <span>ABSENT</span>

          <strong>{absent}</strong>
        </div>

        <div>
          <span>EXCUSED</span>

          <strong>{excused}</strong>
        </div>

        <div>
          <span>TARDY</span>

          <strong>{tardy}</strong>
        </div>
      </section>

      <section className="norse-table-panel">
        <div className="norse-table-header">
          <div>
            <strong>Attendance History</strong>

            <span>
              {student
                ? `${student.firstName} ${student.lastName}`
                : "Student Record"}
            </span>
          </div>

          <span>
            {attendance.length} records
          </span>
        </div>

        {attendance.map((record) => (
          <article
            className="norse-table-row"
            key={record.id}
          >
            <div>
              <span>DATE</span>

              <strong>
                {formatDate(record.date)}
              </strong>
            </div>

            <div>
              <span>STATUS</span>

              <b
                className={getStatusClass(
                  record.status
                )}
              >
                {formatStatus(record.status)}
              </b>
            </div>

            <div>
              <span>NOTE</span>

              <small>
                {record.note ??
                  "No additional note recorded."}
              </small>
            </div>
          </article>
        ))}
      </section>
    </NorseOneShell>
  );
}