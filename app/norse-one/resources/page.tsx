import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

const resources = [
  {
    number: "01",
    title: "Course Resources",
    description:
      "Learning materials, references, and supporting resources connected to your active courses.",
  },
  {
    number: "02",
    title: "Learning Resources",
    description:
      "Supplemental materials designed to support independent learning, practice, and academic growth.",
  },
  {
    number: "03",
    title: "Technology Support",
    description:
      "Technology guides, device resources, and support information for the Academy learning environment.",
  },
  {
    number: "04",
    title: "Academy Resources",
    description:
      "Important Academy information, policies, guides, and resources available to your account.",
  },
];

export default function NorseOneResourcesPage() {
  return (
    <NorseOneShell>
      <section className="norse-page-heading">
        <span>RESOURCES</span>

        <h1>Learning resources.</h1>

        <p>
          Everything you need to support your learning journey inside
          NORSE ONE.
        </p>
      </section>

      <section className="norse-resource-grid">
        {resources.map((resource) => (
          <article
            className="norse-resource-card"
            key={resource.number}
          >
            <span className="norse-resource-number">
              {resource.number}
            </span>

            <h2>{resource.title}</h2>

            <p>{resource.description}</p>

            <button
              type="button"
              className="norse-resource-action"
              disabled
            >
              Coming Soon
            </button>
          </article>
        ))}
      </section>

      <section className="norse-resource-note">
        <span>ACADEMIC SUPPORT</span>

        <h2>More resources are being connected.</h2>

        <p>
          NORSE ONE will eventually connect course materials, lessons, assignments, technology support, academic documents, and other learning resources directly to your account.
        </p>
      </section>
    </NorseOneShell>
  );
}