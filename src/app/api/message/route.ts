import Agnost from "@/lib/agnost";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
  const { endpoint } = Agnost.getServerClient(cookies());
  const { type, ...body } = (await req.json()) as Record<string, any>;
  const path = type === "sub-project" ? "/sub-projects" : "/projects";
  const { data, errors } = await endpoint.put(path, body);
  if (errors) return NextResponse.json({ errors }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/projects");
  return NextResponse.json({ message: data }, { status: 200 });
}
