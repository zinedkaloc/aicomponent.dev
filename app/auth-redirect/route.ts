import altogic from "@/utils/altogic";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const accessToken = url.searchParams.get("access_token") as string;
  const status = url.searchParams.get("status");
  const isOk = status === "200";

  const freeCreditsCookie = req.cookies.get("freeCredits");
  if (freeCreditsCookie && freeCreditsCookie.value === "25") {
    console.log("freeCreditsCookie", freeCreditsCookie);
  }

  const destinationUrl = new URL("/", new URL(req.url).origin);
  const response = NextResponse.redirect(destinationUrl, { status: 302 });

  if (!isOk) return response;

  const { user, session } = await altogic.auth.getAuthGrant(accessToken);

  if (user) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ALTOGIC_API_BASE_URL}/credits`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      },
    );
    if (res.ok) response.cookies.delete("freeCredits");
  }

  if (session) {
    response.cookies.set("sessionToken", session.token, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  return response;
}
