"use server";
import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/database/prisma";

export async function resetPassword(token: string, password: string) {
  if (typeof token !== "string" || token.length > 2048 || typeof password !== "string" || password.length < 12 || Buffer.byteLength(password) > 72) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !process.env.AUTH_SECRET) return false;
  let claim;
  try { claim = JSON.parse(Buffer.from(payload, "base64url").toString()); } catch { return false; }
  if (typeof claim?.id !== "string" || !Number.isSafeInteger(claim.exp) || claim.exp < Date.now()) return false;
  const user = await prisma.user.findUnique({ where: { id: claim.id }, select: { passwordHash: true, status: true } });
  if (!user?.passwordHash || user.status !== "ACTIVE") return false;
  const expected = createHmac("sha256", process.env.AUTH_SECRET).update("odin-reset:" + payload + ":" + user.passwordHash).digest();
  const received = Buffer.from(signature, "base64url");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false;
  // Compare the old hash in the write itself: only the first use of the link can win.
  const changed = await prisma.user.updateMany({ where: { id: claim.id, passwordHash: user.passwordHash, status: "ACTIVE" },
    data: { passwordHash: await bcrypt.hash(password, 12) } });
  return changed.count === 1;
}
