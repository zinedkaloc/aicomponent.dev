import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return logout(req, NextResponse);
}
