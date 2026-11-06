// File introduced 2026-08-17 (fe05ed4).
import { auth } from "@/auth";
import { prisma } from "@/lib/database/prisma";
import { redirect } from "next/navigation";

export async function getMyFamily() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "PARENT") redirect("/norse-one/dashboard");
  // Resolve the household from the signed-in guardian. A family ID in a URL is never proof of membership.
  return prisma.family.findFirst({
    where: { parents: { some: { userId: session.user.id } } },
    include: { students: { orderBy: { firstName: "asc" } }, applications: { orderBy: { submittedAt: "desc" } } },
  });
}
