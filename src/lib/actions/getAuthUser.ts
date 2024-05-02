"use server";

import { User } from "@/types";
import { cookies } from "next/headers";
import myFetch, { ResponseError } from "@/lib/myFetch";
import { env } from "@/env";
import type { APIError } from "@agnost/client";
import { ActionReturn } from "@/lib/actions/types";

export default async function getAuthUser(): ActionReturn<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("sessionToken")?.value;

  if (!token) {
    return { success: true, data: null };
  }

  try {
    const res = await myFetch(env.AGNOST_API_URL + "/agnost/auth/user", {
      headers: {
        Authorization: env.AGNOST_SERVER_API_KEY,
        Session: token,
      },
    });

    const data = (await res.json()) as User | APIError | undefined;
    return { success: true, data: data as User };
  } catch (errors: unknown) {
    if (errors instanceof ResponseError) {
      return { success: false, errors: await errors.response.json() };
    }
    // @ts-ignore
    return { success: false, errors };
  }
}
