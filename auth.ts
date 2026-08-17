import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { authConfig } from "./auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const developmentAccounts = [
  {
    id: "usr-parent-001",
    firstName: "Christian",
    lastName: "Foderingham",
    email: "parent@example.com",
    password: "RavenParent2026!",
    role: "PARENT",
  },
  {
    id: "usr-student-001",
    firstName: "Raven",
    lastName: "Student",
    email: "student@example.com",
    password: "RavenStudent2026!",
    role: "STUDENT",
  },
  {
    id: "usr-teacher-001",
    firstName: "Morgan",
    lastName: "Raven",
    email: "teacher@example.com",
    password: "RavenTeacher2026!",
    role: "TEACHER",
  },
  {
    id: "usr-admin-001",
    firstName: "Academy",
    lastName: "Administrator",
    email: "admin@example.com",
    password: "RavenAdmin2026!",
    role: "ADMINISTRATOR",
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials =
          loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } =
          parsedCredentials.data;

        const user = developmentAccounts.find(
          (account) =>
            account.email.toLowerCase() ===
              email.toLowerCase() &&
            account.password === password
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
});