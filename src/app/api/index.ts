import type { User } from "@/types";
import { type NextRequest, NextResponse } from "next/server";
import { StreamingTextResponse } from "ai";
import actionWrapper from "@/lib/actions/actionWrapper";
import getAuthUser from "@/lib/actions/getAuthUser";

type Data<T> = {
  user: User;
  params: T;
};

export function authWrapper<T>(
  handler: (
    request: NextRequest,
    data: Data<T>,
  ) => Promise<NextResponse | StreamingTextResponse>,
) {
  return async (request: NextRequest, data: Data<T>) => {
    try {
      const user = await actionWrapper(getAuthUser());
      if (!user) return json({ code: "unauthorized" }, { status: 401 });
      data.user = user;
      return handler(request, data);
    } catch {
      return somethingWentWrong();
    }
  };
}

export function json<JsonBody>(
  body: JsonBody,
  init?: ResponseInit,
): NextResponse<JsonBody> {
  return NextResponse.json(body, init);
}

export function badRequest(response?: Record<string, any>) {
  return json(
    {
      code: "bad-request",
      message: "Bad request.",
      ...response,
    },
    { status: 400 },
  );
}

export function notFound(data?: Record<string, any>) {
  return json(data, {
    status: 404,
  });
}

export function somethingWentWrong(response?: any) {
  return json(
    {
      code: "something-went-wrong",
      message: "Something went wrong. Please try again later.",
      ...response,
    },
    { status: 500 },
  );
}
