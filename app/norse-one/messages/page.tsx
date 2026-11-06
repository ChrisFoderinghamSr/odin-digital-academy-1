// File introduced 2026-08-17 (fe05ed4).
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/database/prisma";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  // Archived copies belong to each recipient, so filter the delivery record as well as the message.
  const inbox = await prisma.messageRecipient.findMany({
    where: { recipientId: session.user.id, archived: false, message: { archived: false } },
    include: { message: { include: { sender: { select: { firstName: true, lastName: true } } } } },
    orderBy: { message: { createdAt: "desc" } },
  });
  return <NorseOneShell role={session.user.role}>
    <section className="norse-page-heading"><h1>Messages</h1></section>
    <section className="norse-message-panel">
      {inbox.map(({ message }) => <article key={message.id}><span>{message.sender.firstName} {message.sender.lastName}</span><h2>{message.subject}</h2><p>{message.body}</p></article>)}
      {!inbox.length && <p>Your inbox is empty.</p>}
    </section>
  </NorseOneShell>;
}
