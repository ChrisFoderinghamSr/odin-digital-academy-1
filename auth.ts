// File introduced 2026-08-17 (fe05ed4).
import { createHash } from "node:crypto";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import authConfig from "@/auth.config";
import { prisma } from "@/lib/database/prisma";
import type { NorseOneRole } from "@/types/norse-one";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      name: "NORSE ONE Credentials",

      credentials: {
        email: {
          label: "Email Address",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsed =
          credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // Use the account's own hash so database IDs and permissions follow the same identity.
        const user = await prisma.user.findFirst({
          where: { email: { equals: email.trim(), mode: "insensitive" }, status: "ACTIVE" },
        });
        if (!user?.passwordHash) return null;
        const passwordHash = user.passwordHash;

        const passwordValid =
          await bcrypt.compare(
            password,
            passwordHash
          );

        if (!passwordValid) {
          return null;
        }

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role as NorseOneRole,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      const id = user?.id ?? token.id;
      if (typeof id !== "string") return null;
      const account = await prisma.user.findUnique({ where: { id }, select: { role: true, status: true, passwordHash: true } });
      if (!account?.passwordHash || account.status !== "ACTIVE") return null;
      // Changing a password also retires sessions issued with the previous credential.
      const version = createHash("sha256").update(account.passwordHash).digest("hex");
      if (!user && token.credentialVersion !== version) return null;
      token.id = id;
      token.role = account.role;
      token.credentialVersion = version;
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          typeof token.id === "string"
            ? token.id
            : "";

        session.user.role =
          (token.role as NorseOneRole) ??
          "STUDENT";
      }

      return session;
    },
  },
});