import altogic from "@/utils/altogic";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionCookie } from "@/utils/auth";

export async function PUT(req: Request) {
  const token = getSessionCookie();

  if (!token) {
    return NextResponse.json(
      {
        message: "You must be logged in to update your project.",
      },
      { status: 401 },
    );
  }

  const { type, ...body } = (await req.json()) as Record<string, any>;
  // @ts-ignore
  altogic.auth.setSession({
    token,
  });

  const path = type === "sub-project" ? "/sub-projects" : "/projects";

  const { data, errors } = await altogic.endpoint.put(path, body);

  if (errors) return NextResponse.json({ errors }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/profile/projects");
  return NextResponse.json({ message: data }, { status: 200 });
}
