"use client";
import { ReactNode } from "react";
import ProfileMenu, { MenuItem } from "@/components/ProfileMenu";
import { useParams } from "next/navigation";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const { id } = useParams();

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Components",
      href: "/profile/projects",
    },
    {
      id: 2,
      name: "Invoices",
      href: "/profile/invoices",
    },
    {
      id: 3,
      name: "Settings",
      href: "/profile/settings",
    },
  ];

  if (!id) {
    return (
      <div className="profile-page flex-1 flex flex-col">
        {!id && <ProfileMenu menuItems={menuItems} />}
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
