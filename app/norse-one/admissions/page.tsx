import {account} from "@/lib/academy/access";
import {prisma} from "@/lib/database/prisma";
import {revalidatePath} from "next/cache";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";
async function apply(form:FormData) {
  "use server";
  const user=await account();
  const parent=await prisma.parentProfile.findUnique({where:{userId:user.id}});
  if(user.role!=="PARENT" || !parent?.verified) throw new Error("Verified guardian account required.");
  const [first,last,grade]=["first","last","grade"].map(k=>String(form.get(k)??"").trim());
  if([first,last,grade].some(s=>!s || s.length>100)) throw new Error("Check the student details.");
  await prisma.admissionApplication.create({data:{applicationNumber:crypto.randomUUID(),familyId:parent.familyId,
    studentFirstName:first,studentLastName:last,requestedGrade:grade,status:"SUBMITTED",submittedAt:new Date()}});
  revalidatePath("/norse-one/admissions");
}
async function review(form:FormData) {
  "use server";
  const user=await account();
  const status=form.get("decision");
  if(user.role!=="DIRECTOR" && user.role!=="ADMINISTRATOR") throw new Error("Admissions reviewer required.");
  if(status!=="ACCEPTED" && status!=="WAITLISTED" && status!=="DECLINED") throw new Error("Invalid decision.");
  const change=await prisma.admissionApplication.updateMany({where:{id:String(form.get("id")),status:{in:["SUBMITTED","WAITLISTED","UNDER_REVIEW"]}},data:{status,reviewerId:user.id,reviewedAt:new Date()}});
  if(!change.count) throw new Error("Application has already been reviewed.");
  revalidatePath("/norse-one/admissions");
}
export default async function AdmissionsPage(){
  const user=await account();
  const staff=user.role==="DIRECTOR" || user.role==="ADMINISTRATOR";
  const parent=user.role==="PARENT"?await prisma.parentProfile.findUnique({where:{userId:user.id}}):null;
  const rows=staff || parent?.verified ?await prisma.admissionApplication.findMany({where:staff?{}:{familyId:parent!.familyId},orderBy:{submittedAt:"desc"}}):[];
  return <NorseOneShell><h1>Admissions</h1>{parent?.verified && <form action={apply} className="norse-grade-card">
    <label>Student first name <input name="first" required maxLength={100}/></label><label>Student last name <input name="last" required maxLength={100}/></label>
    <label>Requested grade <input name="grade" required maxLength={100}/></label><button>Submit application</button></form>}
    {!rows.length && <p>No applications are available for this account.</p>}
    {rows.map(a=><article key={a.id}><h2>{a.studentFirstName} {a.studentLastName}</h2><p>{a.requestedGrade} · {a.status}</p>
      {staff && ["SUBMITTED","UNDER_REVIEW","WAITLISTED"].includes(a.status) && <form action={review}><input type="hidden" name="id" value={a.id}/>
        <label>Decision <select name="decision"><option>ACCEPTED</option><option>WAITLISTED</option><option>DECLINED</option></select></label><button>Record decision</button></form>}</article>)}</NorseOneShell>;
}
