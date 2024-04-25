export interface User {
  id: number;
  credits: number;
  email: string;
  lastloginat: string;
  name: string;
  password: string;
  phone: string;
  phoneverified: boolean;
  profilepicture: string;
  provider: string;
  provideruserid: string;
  signupat: string;
  emailverified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  parent: number;
  content: string;
  name: string;
  result: string;
  rating: number;
  role: string;
  rating_text: string;
  created_by: number | User;
  status: "draft" | "live";
  updated_at: string;
  deleted_at: string;
  created_at: string;
}

export interface Payment {
  id: string;
  hosted_invoice_url: string;
  invoice_pdf: string;
  is_test: boolean;
  created_by: number | User;
  project?: number | Project;
  stripe_price_id: string;
  stripe_invoice_id: string;
  updated_at: string;
  created_at: string;
  metadata: Record<string, any>;
  amount: number;
}

export type ProjectHistory = {
  id: number;
  prompt: string;
  ready: boolean;
  result?: string;
  isSubProject: boolean;
};
