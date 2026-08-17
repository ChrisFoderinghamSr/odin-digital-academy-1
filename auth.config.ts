import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isLmsRoute =
        nextUrl.pathname.startsWith("/norse-one");

      if (isLmsRoute) {
        return isLoggedIn;
      }

      return true;
    },
  },

  providers: [],
} satisfies NextAuthConfig;