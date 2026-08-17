import "next-auth";
import "next-auth/jwt";

import type { NorseOneRole } from "@/types/norse-one";

declare module "next-auth" {
  interface User {
    id: string;
    role: NorseOneRole;
  }

  interface Session {
    user: {
      id: string;
      role: NorseOneRole;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: NorseOneRole;
  }
}