import Link from "next/link";
import {prisma} from "@/lib/database/prisma";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import NorseOneShell from "@/components/layout/norse-one/NorseOneShell";

import StudentDashboard from "@/components/norse-one/dashboards/StudentDashboard";
import type { NorseOneRole } from "@/types/norse-one";

const validRoles: NorseOneRole[] = [
  "ADMINISTRATOR",
  "DIRECTOR",
  "DEVELOPER",
  "TEACHER",
  "ASSISTANT",
  "SUPPORT",
  "PARENT",
  "STUDENT",
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sessionRole = session.user.role;

  if (
    !validRoles.includes(
      sessionRole as NorseOneRole
    )
  ) {
    redirect("/login");
  }

  const role = sessionRole as NorseOneRole;

  if (role === "STUDENT") return <NorseOneShell role={role}><StudentDashboard userId={session.user.id}/></NorseOneShell>;
  const inbox=await prisma.messageRecipient.count({where:{recipientId:session.user.id,archived:false}});
  const links=[{href:"messages",label:"Messages ("+inbox+")"}];
  if(role==="PARENT") links.push({href:"family",label:"My family"},{href:"grades",label:"Student grades"},{href:"admissions",label:"Family applications"});
  if(role==="TEACHER") links.push({href:"review",label:"Publish and grade coursework"},{href:"attendance",label:"Class attendance"});
  if(role==="DIRECTOR" || role==="ADMINISTRATOR") links.push({href:"administration/curriculum",label:"Manage curriculum"},{href:"admissions",label:"Review applications"},{href:"enrollment",label:"Enrollment records"});
  return <NorseOneShell role={role}><section className="norse-page-heading"><h1>{session.user.name}’s dashboard</h1></section>
    <section className="norse-stat-grid">{links.map(link=><Link key={link.href} className="norse-stat-card" href={"/norse-one/"+link.href}>{link.label}</Link>)}</section>
  </NorseOneShell>;
}
