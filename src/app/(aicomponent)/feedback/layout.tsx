import AppFooter from "@/components/AppFooter";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Give us your feedback | AIComponent.dev",
  openGraph: {
    title: "Give us your feedback | AIComponent.dev",
  },
  twitter: {
    title: "Give us your feedback | AIComponent.dev",
  },
};

export default function FeedbackLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col justify-between">{children}</div>
  );
}
