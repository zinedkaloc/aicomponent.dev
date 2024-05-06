"use server";
import { agnost } from "@/lib/helpers/Agnost";

export async function createFeedback(data: {
  email: string;
  name: string;
  feedback: string;
  rating: number;
}) {
  return agnost.post("/slack-feedback", data);
}
