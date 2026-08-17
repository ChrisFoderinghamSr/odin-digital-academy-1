import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

export default function AttendancePage() {
  return (
    <NorseOneShell role="STUDENT">
      <section className="norse-page-heading">
        <span>STUDENT RECORD</span>
        <h1>Attendance</h1>
        <p>Review your current academic attendance record.</p>
      </section>

      <section className="norse-attendance-card">
        <div>
          <span>ATTENDANCE RATE</span>
          <strong>97%</strong>
        </div>

        <div>
          <span>PRESENT</span>
          <strong>142</strong>
        </div>

        <div>
          <span>ABSENT</span>
          <strong>4</strong>
        </div>

        <div>
          <span>EXCUSED</span>
          <strong>3</strong>
        </div>
      </section>
    </NorseOneShell>
  );
}