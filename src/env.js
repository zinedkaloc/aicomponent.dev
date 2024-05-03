import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    RETURN_URL: z.string().url().optional(),
    CANCEL_URL: z.string().url(),
    SUCCESS_URL: z.string().url(),
    OPENAI_API_KEY: z.string().min(1),
    AGNOST_SERVER_API_KEY: z.string().min(1),
    AGNOST_API_URL: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_DOMAIN: z.string().url(),
    NEXT_PUBLIC_AGNOST_API_URL: z.string().url(),
    NEXT_PUBLIC_AGNOST_CLIENT_API_KEY: z.string().min(1),
    NEXT_PUBLIC_AGNOST_REALTIME_URL: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side, so we need to destruct manually.
   */
  runtimeEnv: {
    RETURN_URL: process.env.RETURN_URL,
    CANCEL_URL: process.env.CANCEL_URL,
    SUCCESS_URL: process.env.SUCCESS_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AGNOST_SERVER_API_KEY: process.env.AGNOST_SERVER_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
    NEXT_PUBLIC_AGNOST_API_URL: process.env.NEXT_PUBLIC_AGNOST_API_URL,
    NEXT_PUBLIC_AGNOST_CLIENT_API_KEY:
      process.env.NEXT_PUBLIC_AGNOST_CLIENT_API_KEY,
    AGNOST_API_URL: process.env.AGNOST_API_URL,
    NEXT_PUBLIC_AGNOST_REALTIME_URL:
      process.env.NEXT_PUBLIC_AGNOST_REALTIME_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
