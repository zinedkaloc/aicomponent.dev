"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import NavLink from "@/components/NavLink";

const mails = [
  "ozgurozalp1999@gmail.com",
  "mail@ozgurozalp.com",
  "denizlevregi7@gmail.com",
];

export interface MenuItem {
  id: number;
  name: string;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top" | undefined;
}

interface ProfileMenuProps {
  menuItems: MenuItem[];
  className?: string;
}

export default function ProfileMenu({
  menuItems,
  className,
}: ProfileMenuProps) {
  const { user } = useAuth();

  return (
    <div
      className={cn(
        "sub-menu flex h-12 items-center justify-start space-x-2 overflow-x-auto border-b px-6 scrollbar-hide",
        className,
      )}
    >
      {menuItems
        .filter(
          (link) =>
            mails.includes(user?.email as string) || link.name !== "Projects",
        )
        .map((link) => (
          <NavLink
            className={cn(
              "border-b-2 border-transparent text-black",
              "data-[active=true]:border-black",
            )}
            href={link.href}
            key={link.href}
            target={link.target}
          >
            <div className="rounded-md px-3 py-2 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
              <p className="text-sm">{link.name}</p>
            </div>
          </NavLink>
        ))}
    </div>
  );
}
