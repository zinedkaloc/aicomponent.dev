import type { AgnostClient } from "@agnost/client";

export interface User {
  id: number;
  credits: number;
  email: string;
  last_login_at: string;
  name: string;
  password: string;
  phone: string;
  phone_verified: boolean;
  profile_picture: string;
  profilepicture: string;
  provider: string;
  provider_user_id: string;
  signup_at: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  promotion_code_test: string;
  stripe_test_customer_id: string;
  promotion_code: string;
  stripe_customer_id: string;
  is_admin: boolean;
}

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
}

export interface Pagination<T> {
  result: T[];
  pagination: {
    total_records: number;
    current_page: number;
    total_pages: number;
  };
}
