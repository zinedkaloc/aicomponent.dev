import { NextRequest, NextResponse } from "next/server";
import { fetchProjectById } from "@/utils/auth";
import { initialIframeContent } from "@/utils/helpers";

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
  const project = await fetchProjectById(params.id, "project");

  if (!project) {
    return new NextResponse("Not found", { status: 404 });
  }

  const res = new NextResponse(initialIframeContent + project.result, {
    status: 200,
  });

  res.headers.set("Content-Type", "text/html");

  return res;
}
