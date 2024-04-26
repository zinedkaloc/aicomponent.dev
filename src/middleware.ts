import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/env";

export async function middleware(request: NextRequest) {
  let path = request.nextUrl.pathname;
  const PROTECTED_PATHS = ["/profile", "/projects", "/start-building"];
  const session = cookies().has("sessionToken");

  const isProtectedPage = PROTECTED_PATHS.some((protectedPath) =>
    path.startsWith(protectedPath),
  );

  if (isProtectedPage && !session && path !== "/auth") {
    return NextResponse.redirect(env.NEXT_PUBLIC_APP_DOMAIN);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|favicon.svg|favicon.png|health/|health).*)",
  ],
};
