import { NextRequest, NextResponse } from "next/server";
import { actionWrapper, getProjectById } from "@/lib/actions";
import { notFound } from "@/app/api";

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
  const project = await actionWrapper(getProjectById(+params.id));

  if (!project) {
    return notFound({ message: "Project not found" });
  }

  let content = project.result;

  if (!content) {
    content = `<style>* {margin: 0; padding: 0 1rem}</style><div style="display: flex; justify-content: center; align-items: center; font-size: 1rem; height: 100vh; text-align: center">
        <h1>No Content Found For This Project</h1>
    </div>`;
  }

  const res = new NextResponse(content, {
    status: 200,
  });

  res.headers.set("Content-Type", "text/html");

  return res;
}
