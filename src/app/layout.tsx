import AuthModal from "@/components/AuthModal";
import PricesModal from "@/components/PricesModal";
import { AuthProvider } from "@/context/AuthContext";
import { fetchProducts } from "@/lib/auth";
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
  const products = await fetchProducts();

  return (
    <AuthProvider user={user ?? null}>
      <QueryProvider>
        <html lang="en">
          <body>
            {children}
            <AuthModal />
            <PricesModal products={products} />
            <Toaster position="top-center" />
          </body>
        </html>
      </QueryProvider>
    </AuthProvider>
  );
}
