import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import authConfig from "@/auth.config";
import { mockUsers } from "@/lib/data/mock/users";
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

        const user = mockUsers.find(
          (candidate) =>
            candidate.email.toLowerCase() ===
              email.toLowerCase() &&
            candidate.active
        );

        if (!user) {
          return null;
        }

        const passwordHash =
          process.env.NORSE_DEMO_PASSWORD_HASH;

        if (!passwordHash) {
          console.error(
            "NORSE_DEMO_PASSWORD_HASH is not configured."
          );

          return null;
        }

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
      if (user) {
        token.id = user.id;
        token.role =
          user.role as NorseOneRole;
      }

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