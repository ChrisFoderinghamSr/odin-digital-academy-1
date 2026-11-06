import { createHmac } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Run from a trusted operator terminal after verifying the account owner out of band.
const { DATABASE_URL, AUTH_SECRET, AUTH_URL } = process.env;
if (!DATABASE_URL || !AUTH_SECRET || !AUTH_URL) throw new Error("Set DATABASE_URL, AUTH_SECRET and AUTH_URL first.");
const base = new URL(AUTH_URL);
if (base.protocol !== "https:" && base.hostname !== "localhost") throw new Error("Use the academy HTTPS origin.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });
try {
  const user = await prisma.user.findUniqueOrThrow({ where: { email: process.argv[2] }, select: { id: true, passwordHash: true, status: true } });
  if (user.status !== "ACTIVE" || !user.passwordHash) throw new Error("Recovery requires an active password account.");
  const payload = Buffer.from(JSON.stringify({ id: user.id, exp: Date.now() + 15 * 60_000 })).toString("base64url");
  const signature = createHmac("sha256", AUTH_SECRET).update("odin-reset:" + payload + ":" + user.passwordHash).digest("base64url");
  // A fragment keeps the bearer secret out of access logs and HTTP referrers.
  const link = new URL("/login/forgot-password", base);
  link.hash = payload + "." + signature;
  console.log(link.href);
} finally { await prisma.$disconnect(); }
