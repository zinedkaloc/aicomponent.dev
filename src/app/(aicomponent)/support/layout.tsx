import AppFooter from "@/components/AppFooter";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Support | AIComponent.dev",
  openGraph: {
    title: "Support | AIComponent.dev",
    images: "/ogs/og-support.webp",
  },
  twitter: {
    title: "Support | AIComponent.dev",
    images: "/ogs/og-support.webp",
  },
};

export default function SupportLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col justify-between">{children}</div>
  );
}
