import "@smastrom/react-rating/style.css";
import { ReactNode } from "react";
import Header from "@/components/Header";
import dynamic from "next/dynamic";

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
    </>
  );
}
