import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

const assignments = [
  ["Multiplication Practice", "Mathematics", "Today", "IN PROGRESS"],
  ["Reading Response", "Literature", "Tomorrow", "NOT STARTED"],
  ["Living Systems Project", "Science", "Friday", "IN PROGRESS"],
  ["Leadership Reflection", "Life Skills", "Monday", "SUBMITTED"],
];

export default function AssignmentsPage() {
  return (
    <NorseOneShell role="STUDENT">
      <section className="norse-page-heading">
        <span>ACADEMIC WORK</span>
        <h1>Assignments</h1>
        <p>Review, complete, submit, and track your coursework.</p>
      </section>

      <section className="norse-table-panel">
        <div className="norse-table-header">
          <strong>Current Assignments</strong>
          <span>4 items</span>
        </div>

        {assignments.map(([title, course, due, status]) => (
          <article className="norse-table-row" key={title}>
            <div>
              <span>{course}</span>
              <strong>{title}</strong>
            </div>

            <small>{due}</small>

            <b className={`assignment-status ${status.toLowerCase().replace(" ", "-")}`}>
              {status}
            </b>
          </article>
        ))}
      </section>
    </NorseOneShell>
  );
}