import "@smastrom/react-rating/style.css";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
import AppFooter from "@/components/AppFooter";

const Socials = dynamic(() => import("@/components/Socials"), { ssr: false });

export default async function AipageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <Socials />
      {children}
      <AppFooter />
    </>
  );
}
