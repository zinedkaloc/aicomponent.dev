import { createClient } from "@agnost/client";
import { env } from "@/env";
import { isClient } from "@/lib/utils";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export default class Agnost {
  static getBrowserClient() {
    if (isClient()) {
      window.agnost ??= createClient(
        env.NEXT_PUBLIC_AGNOST_API_URL,
        env.NEXT_PUBLIC_AGNOST_CLIENT_API_KEY,
      );

      return window.agnost;
    }

    return createClient(
      env.NEXT_PUBLIC_AGNOST_API_URL,
      env.NEXT_PUBLIC_AGNOST_CLIENT_API_KEY,
    );
  }

  static getRealtimeClient() {
    return createClient(
      env.NEXT_PUBLIC_AGNOST_REALTIME_URL,
      env.NEXT_PUBLIC_AGNOST_CLIENT_API_KEY,
    );
  }

  /**
   *
   * @example const client = Agnost.getServerClient(cookies());
   */
  static getServerClient(cookies?: ReadonlyRequestCookies) {
    if (isClient()) {
      throw new Error(
        "Agnost.getServerClient() should only be called on the server.",
      );
    }

    const token = cookies?.get("sessionToken")?.value;
    const userId = cookies?.get("userId")?.value;

    const client = createClient(env.AGNOST_API_URL, env.AGNOST_SERVER_API_KEY);

    // @ts-ignore
    client.auth.setSession({
      ...(token && { token }),
      ...(userId && { userId }),
    });

    return client;
  }
}
