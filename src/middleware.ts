import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/env";
import getAuthUser from "@/lib/actions/getAuthUser";
import actionWrapper from "@/lib/actions/actionWrapper";

export async function middleware(request: NextRequest) {
  let path = request.nextUrl.pathname;
  const PROTECTED_PATHS = ["/profile", "/projects", "/start-building"];
  const session = cookies().has("sessionToken");

  const isProtectedPage = PROTECTED_PATHS.some((protectedPath) =>
    path.startsWith(protectedPath),
  );

  if (path.startsWith("/admin")) {
    const user = await actionWrapper(getAuthUser());
    if (!user?.is_admin) {
      return NextResponse.redirect(env.NEXT_PUBLIC_APP_DOMAIN);
    }
  }

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
