import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

// An operator provisions one identity at a time. Existing emails fail rather than silently changing roles.
const input = z.object({
  DATABASE_URL: z.string().min(1), ACCOUNT_EMAIL: z.email(), ACCOUNT_PASSWORD: z.string().min(12).refine(v => Buffer.byteLength(v) <= 72),
  FIRST_NAME: z.string().trim().min(1), LAST_NAME: z.string().trim().min(1),
  ACCOUNT_ROLE: z.enum(["PARENT", "STUDENT", "TEACHER", "ASSISTANT", "DIRECTOR", "DEVELOPER", "SUPPORT", "ADMINISTRATOR"]),
  FAMILY_ID: z.string().optional(), ACADEMIC_LEVEL: z.string().optional(),
}).safeParse(process.env);
if (!input.success) throw new Error("Check the provisioning variables in the release guide.");
const v = input.data;
if (v.ACCOUNT_ROLE === "STUDENT" && (!v.FAMILY_ID || !v.ACADEMIC_LEVEL)) throw new Error("Students require FAMILY_ID and ACADEMIC_LEVEL.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: v.DATABASE_URL }) });
try {
  const passwordHash = await bcrypt.hash(v.ACCOUNT_PASSWORD, 12);
  const result = await prisma.$transaction(async tx => {
    const user = await tx.user.create({ data: { email: v.ACCOUNT_EMAIL.trim().toLowerCase(), firstName: v.FIRST_NAME, lastName: v.LAST_NAME, role: v.ACCOUNT_ROLE, passwordHash } });
    if (v.ACCOUNT_ROLE === "PARENT") {
      const familyId = v.FAMILY_ID || (await tx.family.create({ data: { familyName: v.LAST_NAME } })).id;
      await tx.parentProfile.create({ data: { userId: user.id, familyId, relationship: "Guardian", verified: true, primary: !v.FAMILY_ID } });
      return { userId: user.id, familyId };
    }
    if (v.ACCOUNT_ROLE === "STUDENT") {
      await tx.studentProfile.create({ data: { userId: user.id, familyId: v.FAMILY_ID, academicLevel: v.ACADEMIC_LEVEL, studentNumber: user.id,
        firstName: v.FIRST_NAME, lastName: v.LAST_NAME } });
    } else {
      await tx.staffProfile.create({ data: { userId: user.id, employeeId: user.id, title: v.ACCOUNT_ROLE } });
    }
    return { userId: user.id };
  });
  console.log(result);
} finally { await prisma.$disconnect(); }
