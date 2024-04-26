import AuthModal from "@/components/AuthModal";
import { AuthProvider } from "@/context/AuthContext";
import "../styles/global.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { actionWrapper, getAuthUser } from "@/lib/actions";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/app/provider";

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
  const user = await actionWrapper(getAuthUser());

  return (
    <QueryProvider>
      <AuthProvider user={user ?? null}>
        <html lang="en">
          <body>
            {children}
            <AuthModal />
            <Toaster position="top-center" />
          </body>
        </html>
      </AuthProvider>
    </QueryProvider>
  );
}
