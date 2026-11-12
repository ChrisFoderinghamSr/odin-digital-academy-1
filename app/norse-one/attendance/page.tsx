import {account,studentsFor} from "@/lib/academy/access";
import {prisma} from "@/lib/database/prisma";
import {revalidatePath} from "next/cache";
import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";
async function record(form:FormData) {
  "use server";
  const user=await account();
  if (user.role !== "TEACHER") throw new Error("Teacher sign-in required.");
  const status=form.get("status");
  if(status !== "PRESENT" && status !== "ABSENT" && status !== "EXCUSED" && status !== "TARDY") throw new Error("Invalid status.");
  const day=String(form.get("date")??"");
  const date=new Date(day+"T00:00:00Z");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==day) throw new Error("Invalid date.");
  const member=await prisma.classroomStudent.findFirst({where:{id:String(form.get("member")),classroom:{teacher:{userId:user.id},active:true}}});
  if(!member) throw new Error("Student is outside this classroom.");
  const {studentId,classroomId}=member;
  await prisma.attendanceRecord.upsert({where:{studentId_classroomId_date:{studentId,classroomId,date}},create:{studentId,classroomId,date,status},update:{status}});
  revalidatePath("/norse-one/attendance");
}
export default async function AttendancePage(){
  const user=await account();
  const where=user.role==="TEACHER"?{classroom:{teacher:{userId:user.id}}}:{student:studentsFor(user)};
  const records=await prisma.attendanceRecord.findMany({where,include:{student:true,classroom:true},orderBy:{date:"desc"},take:150});
  const roster=user.role==="TEACHER"?await prisma.classroomStudent.findMany({where:{classroom:{teacher:{userId:user.id},active:true}},include:{student:true,classroom:true}}):[];
  return <NorseOneShell><h1>Attendance</h1>{roster.length>0 && <form action={record} className="norse-grade-card">
    <label>Student and classroom <select name="member">{roster.map(m=><option key={m.id} value={m.id}>{m.student.firstName} {m.student.lastName} · {m.classroom.name}</option>)}</select></label>
    <label>Date <input type="date" name="date" required/></label><label>Attendance status <select name="status">{["PRESENT","ABSENT","EXCUSED","TARDY"].map(s=><option key={s}>{s}</option>)}</select></label>
    <button>Save attendance</button></form>}{!records.length && <p>No attendance has been recorded.</p>}
    {records.map(r=><p key={r.id}>{r.date.toISOString().slice(0,10)} · {r.student.firstName} {r.student.lastName} · {r.classroom.name} · {r.status}</p>)}</NorseOneShell>;
}
