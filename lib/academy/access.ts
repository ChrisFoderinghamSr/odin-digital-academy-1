import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
export async function account() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}
type Account = Awaited<ReturnType<typeof account>>;
export function studentsFor(user:Account): Prisma.StudentProfileWhereInput {
  switch(user.role) {
    case "ADMINISTRATOR": case "DIRECTOR": return {};
    case "PARENT": return {family:{parents:{some:{userId:user.id,verified:true}}}};
    case "TEACHER": return {classroomMembers:{some:{classroom:{teacher:{userId:user.id}}}}};
    default: return {userId:user.id};
  }
}
export function coursesFor(user:Account): Prisma.CourseWhereInput {
  if (user.role === "ADMINISTRATOR" || user.role === "DIRECTOR") return {active:true};
  if (user.role === "TEACHER") return {active:true,instructor:{userId:user.id}};
  return {active:true,classrooms:{some:{students:{some:{student:studentsFor(user)}}}}};
}
