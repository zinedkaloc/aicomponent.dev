import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const hasPromoCode = url.searchParams.has("PromoCode");
  const promoCode = url.searchParams.get("PromoCode");

  const response = NextResponse.next();

  if (hasPromoCode && promoCode === "25Free") {
    response.cookies.set({
      name: "freeCredits",
      value: "25",
      path: "/",
      httpOnly: true,
    });
  }

  return response;
}
