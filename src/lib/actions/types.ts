import type { APIError } from "@agnost/client";
import { z } from "zod";

export type ActionReturn<T> = Promise<
  { success: true; data: T } | { success: false; errors: APIError }
>;

export const CreateCheckoutSessionScheme = z.object({
  priceId: z.string(),
  sessionMode: z.enum(["subscription", "payment"]).default("payment"),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type CreateCheckoutSessionParams = z.infer<
  typeof CreateCheckoutSessionScheme
>;
