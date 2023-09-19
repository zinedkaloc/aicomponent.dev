import AuthModal from "@/components/AuthModal";
import PricesModal from "@/components/PricesModal";
import { AuthProvider } from "@/context/AuthContext";
import { fetchAuthUser, fetchProducts } from "@/utils/auth";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "../styles/globals.css";
const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AIComponent.dev - An AI-Powered Component Generator",
    description:
      "AI-Powered Component Generator. Experience the Open Source Project that Empowers You to Build Stunning Components Instantly",
    openGraph: {
      title: "AIComponent.dev - An AI-Powered Component Generator",
      description:
        "AI-Powered Component Generator. Experience the Open Source Project that Empowers You to Build Stunning Components Instantly",
      type: "website",
      url: "https://aicomponent.dev",
      images: `${process.env.NEXT_PUBLIC_DOMAIN}/api/og?text=${new Date()
        .getTime()
        .toString()}`,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await fetchAuthUser();
  const products = await fetchProducts();

  return (
    <AuthProvider user={user ?? null}>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <AuthModal />
          <PricesModal products={products} />
        </body>
      </html>
    </AuthProvider>
  );
}
