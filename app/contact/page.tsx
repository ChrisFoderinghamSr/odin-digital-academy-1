// File introduced 2026-08-17 (fe05ed4).
import { z } from "zod";
import { connection } from "next/server";

export default async function ContactPage() {
  await connection();
  // One configured mailbox serves admissions, account recovery and general support.
  const contact = z.email().safeParse(process.env.ACADEMY_SUPPORT_EMAIL);
  return <main className="public-page"><section className="section section-white"><div className="container application-card">
    <h1>Contact the academy</h1><p>For admissions, coursework, or account recovery, include your name and a short description of what you need.</p>
    {contact.success ? <a className="button button-gold" href={"mailto:" + contact.data}>Email {contact.data}</a> :
      <p>Use the academy contact who issued your account. A public support address has not been configured.</p>}
  </div></section></main>;
}
