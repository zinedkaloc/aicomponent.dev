import { NextRequest, NextResponse } from "next/server";
import { fetchProjectById } from "@/utils/auth";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
    };
  },
) {
  const project = await fetchProjectById(params.id, "sub-project");

  if (!project) {
    return new NextResponse("Not found", { status: 404 });
  }

  const res = new NextResponse(project.result, { status: 200 });

  res.headers.set("Content-Type", "text/html");

  return res;
}
