"use server";

import Agnost from "@/lib/agnost";
import { ActionReturn } from "@/lib/actions/types";
import { Pagination, User, UserSchema } from "@/types";
import { cookies } from "next/headers";
import { APIError } from "@agnost/client";

export async function updateUser(
  id: number,
  userData: Partial<User>,
): ActionReturn<User> {
  const parsed = UserSchema.pick({
    email: true,
    name: true,
    credits: true,
    stripe_customer_id: true,
    stripe_test_customer_id: true,
    promotion_code_test: true,
    promotion_code: true,
    is_admin: true,
  }).safeParse(userData);

  if (!parsed.success) {
    const errors: APIError = {
      status: 400,
      items: [
        {
          message: "Bad Request",
          code: "zod_error",
          origin: "body",
          details: parsed.error.flatten(),
        },
      ],
      statusText: "Bad Request",
    };

    console.log(parsed.error.flatten());
    return { success: false, errors };
  }

  const client = Agnost.getServerClient(cookies());

  const { errors, data } = await client.endpoint.put(
    `/admin/users/${id}`,
    userData,
  );

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data: data as User };
}

export async function deleteUser(id: number): ActionReturn<boolean> {
  const client = Agnost.getServerClient(cookies());

  const { errors, data } = await client.endpoint.delete(`/admin/users/${id}`);

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data: true };
}

export async function getUsers(options: {
  page: number;
  limit: number;
  search?: string;
}): ActionReturn<Pagination<User>> {
  const client = Agnost.getServerClient(cookies());

  const { errors, data } = await client.endpoint.get(
    `/admin/users?${new URLSearchParams(options as any).toString()}`,
  );

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data: data as Pagination<User> };
}

export async function getUser(id: number): ActionReturn<User> {
  const client = Agnost.getServerClient(cookies());

  const { errors, data } = await client.endpoint.get(`/admin/users/${id}`);

  if (errors) {
    console.error(errors);
    return { success: false, errors };
  }

  return { success: true, data: data as User };
}
