"use server";

import Agnost from "@/lib/agnost";
import { cookies } from "next/headers";
import { PriceListResponse, Project, User } from "@/types";
import type { APIError } from "@agnost/client";
import { z } from "zod";
import { env } from "@/env";

export type ActionReturn<T> = Promise<
  { success: true; data: T } | { success: false; errors: APIError }
>;

const CreateCheckoutSessionScheme = z.object({
  priceId: z.string(),
  sessionMode: z.enum(["subscription", "payment"]).default("payment"),
  metadata: z.record(z.string(), z.any()).optional(),
});

type CreateCheckoutSessionParams = z.infer<typeof CreateCheckoutSessionScheme>;

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams,
): ActionReturn<any> {
  const client = Agnost.getServerClient(cookies());
  const { errors, data } = await client.endpoint.post("/checkout-session", {
    mode: process.env.NODE_ENV === "production" ? "PRODUCTION" : "TEST",
    ...params,
    cancel_url: env.CANCEL_URL,
    success_url: env.SUCCESS_URL,
  });
  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }
  return { success: true, data };
}

export async function getPricingData(): ActionReturn<PriceListResponse> {
  const client = Agnost.getServerClient();
  const { errors, data } = await client.endpoint.get(
    `/pricing?${new URLSearchParams({ mode: env.NODE_ENV === "production" ? "PRODUCTION" : "TEST" })}`,
  );

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data };
}

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
  channelId: string,
): ActionReturn<Project> {
  const client = Agnost.getServerClient(cookies());

  const { errors, data: project } = await client.endpoint.post("/projects", {
    ...data,
    channelId,
  });

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data: project as Project };
}

export async function updateProject(
  id: number,
  data: Omit<Partial<Project>, "id">,
  duration: number,
): ActionReturn<Project> {
  const client = Agnost.getServerClient(cookies());

  const { errors, data: project } = await client.endpoint.put(
    `/projects/${id}`,
    { ...data, duration },
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

// Webhook Error: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe?
//  If a webhook request is being forwarded by a third-party tool, ensure that the exact request body, including JSON formatting and new line style, is preserved.
// Learn more about webhook signing and explore webhook integration examples for various frameworks at https://github.com/stripe/stripe-node#webhook-signing
// ,
