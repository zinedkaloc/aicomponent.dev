"use client";
import { ReactNode } from "react";
import ProfileMenu, { MenuItem } from "@/components/ProfileMenu";
import { useParams } from "next/navigation";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const { id } = useParams();

  const hasIdMenu: MenuItem[] = [
    {
      id: 1,
      name: "Design",
      href: `/profile/projects/${id}`,
    },
    {
      id: 5,
      name: "Settings",
      href: `/profile/projects/${id}/settings`,
    },
  ];
  const hasNoIdMenu: MenuItem[] = [
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

  return (
    <div className="profile-page flex-1 flex flex-col">
      <ProfileMenu menuItems={id ? hasIdMenu : hasNoIdMenu} />
      {children}
    </div>
  );
}
