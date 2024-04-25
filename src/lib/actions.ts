"use server";

import Agnost from "@/lib/agnost";
import { cookies } from "next/headers";
import { Project, User } from "@/types";
import type { APIError } from "@agnost/client";

export type ActionReturn<T> = Promise<
  { success: true; data: T } | { success: false; errors: APIError }
>;

export async function updateAuthUser(user: Partial<User>): ActionReturn<User> {
  const client = Agnost.getServerClient(cookies());

  const { errors, data } = await client.endpoint.put("/users/me", user);

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data: data as User };
}

export async function deleteProfile(): ActionReturn<undefined> {
  const client = Agnost.getServerClient(cookies());

  const { errors } = await client.endpoint.delete("/users/me");

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  await signOut();

  return { success: true, data: undefined };
}

export async function signOut(): ActionReturn<undefined> {
  const client = Agnost.getServerClient(cookies());
  const { errors } = await client.auth.signOut();

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  cookies().delete("sessionToken");
  cookies().delete("userId");

  return { success: true, data: undefined };
}

export async function getAuthUser(): ActionReturn<User | null> {
  const cookieStore = cookies();
  const hasSession = cookieStore.has("sessionToken");

  if (!hasSession) {
    return { success: true, data: null };
  }

  const client = Agnost.getServerClient(cookies());
  const { user, errors } = await client.auth.getUserFromDB();

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data: user as unknown as User };
}

export async function createProject(
  data: Omit<Partial<Project>, "id" | "created_by">,
): ActionReturn<Project> {
  const client = Agnost.getServerClient(cookies());

  const { errors, data: project } = await client.endpoint.post(
    "/projects",
    data,
  );

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data: project as Project };
}

export async function updateProject(
  id: number,
  data: Omit<Partial<Project>, "id">,
): ActionReturn<Project> {
  const client = Agnost.getServerClient(cookies());

  const { errors, data: project } = await client.endpoint.put(
    `/projects/${id}`,
    data,
  );

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data: project as Project };
}

export async function getProjects(): ActionReturn<Project[]> {
  const client = Agnost.getServerClient(cookies());

  const { errors, data: project } = await client.endpoint.get(`/projects`);

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data: project as Project[] };
}

export async function getProjectById(id: number): ActionReturn<Project> {
  const client = Agnost.getServerClient(cookies());

  const { errors, data: project } = await client.endpoint.get(
    `/projects/${id}`,
  );

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data: project as Project };
}

export async function actionWrapper<T>(action: ActionReturn<T>) {
  const result = await action;

  if (!result.success) {
    throw result.errors;
  }

  return result.data;
}
