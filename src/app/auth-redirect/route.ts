import { NextRequest, NextResponse } from "next/server";
import Agnost from "@/lib/agnost";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const { auth } = Agnost.getServerClient();

  const accessToken = url.searchParams.get("access_token") as string;
  const status = url.searchParams.get("status");
  const isOk = status === "200";

  const destinationUrl = new URL("/", new URL(req.url).origin);
  const response = NextResponse.redirect(destinationUrl, { status: 302 });

  if (!isOk)
    return new Response(
      `${JSON.stringify(Object.fromEntries(url.searchParams.entries()), null, 4)}`,
      {
        status: status ? parseInt(status) : 500,
        headers: {
          "content-type": "application/json",
        },
      },
    );

  const { user, session } = await auth.getAuthGrant(accessToken);

  if (session && user) {
    response.cookies.set("sessionToken", session.token, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    response.cookies.set("creationDtm", session.creationDtm, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    response.cookies.set("userId", user.id.toString(), {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  return response;
}
