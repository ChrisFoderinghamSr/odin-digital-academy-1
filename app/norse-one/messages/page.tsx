import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

export default function MessagesPage() {
  return (
    <NorseOneShell role="STUDENT">
      <section className="norse-page-heading">
        <span>COMMUNICATION</span>
        <h1>Messages</h1>
        <p>Stay connected with instructors and the Academy.</p>
      </section>

      <section className="norse-message-panel">
        <article>
          <span>Ms. Raven • Mathematics</span>
          <strong>Great progress this week!</strong>
          <p>
            Your latest mathematics work shows excellent improvement.
          </p>
        </article>

        <article>
          <span>Odin Digital Academy</span>
          <strong>Weekly Academy Newsletter</strong>
          <p>
            Review this week&apos;s announcements and upcoming activities.
          </p>
        </article>
      </section>
    </NorseOneShell>
  );
}