// File introduced 2026-08-17 (fe05ed4). Page redirects help navigation; write operations check permissions again on the server.
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  if (!request.auth?.user?.id) {
    const loginUrl = new URL("/login", request.nextUrl.origin);

    loginUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/norse-one/:path*"],
};