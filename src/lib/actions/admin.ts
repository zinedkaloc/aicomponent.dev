"use server";

import Agnost from "@/lib/agnost";
import { ActionReturn } from "@/lib/actions/types";
import { Pagination, User } from "@/types";
import { cookies } from "next/headers";

export async function updateUser(
  id: number,
  userData: Partial<User>,
): ActionReturn<User> {
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
