import type { AgnostClient, User as AgnostUser } from "@agnost/client";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  credits: z
    .number({
      message: "Credits must be a number",
    })
    .positive({
      message: "Credits must be a positive number",
    }),
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Email must be a valid email" }),
  last_login_at: z.string(),
  name: z.string({
    message: "Name must be a string",
  }),
  password: z.string(),
  phone: z.string().nullish(),
  phone_verified: z.boolean(),
  profile_picture: z.string().nullish(),
  profilepicture: z.string().optional(),
  provider: z.string().nullish(),
  provider_user_id: z.string().nullish(),
  signup_at: z.string(),
  email_verified: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  promotion_code_test: z.string().nullish(),
  stripe_test_customer_id: z.string().nullish(),
  promotion_code: z.string().nullish(),
  stripe_customer_id: z.string().nullish(),
  is_admin: z.boolean(),
});

export type MyUser = z.infer<typeof UserSchema>;

export interface User extends AgnostUser {}

export interface Project {
  id: number;
  parent: number;
  prompt: string;
  name: string;
  result: string;
  rating: number;
  role: string;
  rating_text: string;
  created_by: number | User;
  status: "draft" | "live";
  sub_projects: Project[];
  updated_at: string;
  deleted_at: string;
  created_at: string;
}

export interface Payment {
  id: string;
  hosted_invoice_url: string;
  stripe_customer_id: string;
  invoice_pdf: string;
  is_test: boolean;
  total_amount: number;
  created_by: number | User;
  project?: number | Project;
  stripe_price_id: string;
  stripe_invoice_id: string;
  updated_at: string;
  created_at: string;
  metadata: Record<string, any>;
}

export type ProjectHistory = {
  id: number;
  prompt: string;
  ready: boolean;
  result?: string;
  isSubProject: boolean;
};

declare global {
  interface Window {
    agnost: AgnostClient;
  }
}

export interface Price {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: null | number;
  livemode: boolean;
  lookup_key: null | string;
  metadata: {
    amount: string;
    feature_1: string;
    feature_2: string;
    feature_3: string;
  };
  nickname: null | string;
  product: string;
  recurring: null | any;
  tax_behavior: string;
  tiers_mode: null | string;
  transform_quantity: null | string;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}

export interface PriceListResponse {
  object: string;
  data: Price[];
  has_more: boolean;
  url: string;
}

export interface PriceMetadata {
  amount: string;
  name: string;
  description: string;
  feature_1: string;
  feature_2: string;
  feature_3: string;
  feature_4: string;
  features: string[];
}

export interface Pagination<T> {
  result: T[];
  pagination: {
    total_records: number;
    current_page: number;
    total_pages: number;
  };
}

declare module "@agnost/client" {
  interface User extends MyUser {}
}

export type AgnostError = {
  errors: {
    origin: string;
    code: string;
    message: string;
    details: {
      name: string;
      code: string;
      message: string;
      stack: string;
    };
  };
};
