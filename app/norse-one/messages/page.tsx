import {account} from "@/lib/academy/access";
import {prisma} from "@/lib/database/prisma";
import {revalidatePath} from "next/cache";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";
async function send(form:FormData){
  "use server";
  const sender = await account();
  const subject = String(form.get("subject") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  if (!subject || subject.length > 200 || !body || body.length > 10000) throw new Error("Check the subject and message.");
  const recipient = await prisma.user.findFirst({where:{email:{equals:email,mode:"insensitive"},status:"ACTIVE"},select:{id:true}});
  if (!recipient) throw new Error("Unable to deliver to that academy email.");
  await prisma.message.create({data:{senderId:sender.id,subject,body,recipients:{create:{recipientId:recipient.id}}}});
  revalidatePath("/norse-one/messages");
}
export default async function MessagesPage(){
  const {id}=await account();
  const rows=await prisma.message.findMany({where:{OR:[{senderId:id},{recipients:{some:{recipientId:id,archived:false}}}]},include:{sender:{select:{firstName:true,lastName:true}}},orderBy:{createdAt:"desc"},take:100});
  return <NorseOneShell><h1>Messages</h1><form action={send} className="norse-grade-card">
    <label>Recipient academy email <input type="email" name="email" required/></label>
    <label>Subject <input name="subject" maxLength={200} required/></label>
    <label>Message <textarea name="body" maxLength={10000} required/></label><button>Send message</button></form>
    {!rows.length && <p>Your inbox is empty.</p>}{rows.map(m=><article key={m.id}><h2>{m.subject}</h2>
      <small>{m.sender.firstName} {m.sender.lastName} · {m.createdAt.toLocaleDateString()}</small><p>{m.body}</p></article>)}</NorseOneShell>;
}
