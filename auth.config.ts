// File introduced 2026-08-17 (fe05ed4).
import type { NextAuthConfig } from "next-auth";

const authConfig = {
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  providers: [],
} satisfies NextAuthConfig;

export default authConfig;