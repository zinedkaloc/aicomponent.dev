import AuthModal from "@/components/AuthModal";
import { AuthProvider } from "@/context/AuthContext";
import "../styles/global.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/app/provider";
import { User } from "@/types";
import actionWrapper from "@/lib/actions/actionWrapper";
import getAuthUser from "@/lib/actions/getAuthUser";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://aicomponent.dev"),
    title: "AIComponent.dev - An AI-Powered Component Generator",
    description:
      "AI-Powered Component Generator. Experience the Open Source Project that Empowers You to Build Stunning Components Instantly",
    openGraph: {
      title: "AIComponent.dev - An AI-Powered Component Generator",
      description:
        "AI-Powered Component Generator. Experience the Open Source Project that Empowers You to Build Stunning Components Instantly",
      type: "website",
      url: "https://aicomponent.dev",
      images: `/api/og?text=${new Date().getTime().toString()}`,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  let user: User | null = null;
  try {
    user = await actionWrapper(getAuthUser());
  } catch {}

  return (
    <QueryProvider>
      <AuthProvider user={user}>
        <html lang="en">
          <body>
            {children}
            <AuthModal />
            <Toaster position="top-center" closeButton />
          </body>
        </html>
      </AuthProvider>
    </QueryProvider>
  );
}
