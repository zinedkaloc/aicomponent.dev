"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { capitalize, cn } from "@/lib/utils";
import {
  DropDownItemWithIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  Coins,
  Layout,
  LogOut,
  Newspaper,
  Receipt,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface UserAvatarProps {
  withDropdown?: boolean;
}

export default function UserAvatar({ withDropdown }: UserAvatarProps) {
  const { user, logout } = useAuth();
  const { setTheme, theme: currentTheme } = useTheme();

  const themes = ["light", "dark", "system"];

  const DROPDOWN_ITEMS = [
    [
      {
        icon: <Layout size={16} />,
        onClick: undefined,
        href: "/projects",
        label: "Projects",
      },
      {
        icon: <Coins size={16} />,
        onClick: undefined,
        href: "/buy-credits",
        label: "Buy Credits",
      },
    ],
    [
      {
        icon: <User size={16} />,
        onClick: undefined,
        href: "/profile",
        label: "Profile",
      },
      {
        icon: <Receipt size={16} />,
        onClick: undefined,
        href: "/profile/invoices",
        label: "Billing & Invoices",
      },
      {
        icon: <LogOut size={16} />,
        onClick: () => logout("/"),
        href: undefined,
        label: "Log out",
      },
    ],
  ];

  if (!user) return null;

  const Main = (
    <Avatar
      className={cn("h-8 w-8 select-none", withDropdown && "cursor-pointer")}
    >
      <AvatarImage alt={user?.name!} src={user?.profile_picture} />
      <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
    </Avatar>
  );

  if (!withDropdown) return Main;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex h-8 w-8 items-center justify-center rounded-full"
        >
          {Main}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-44 min-w-[15rem] origin-top-right rounded-xl border-border bg-background p-0 shadow-none"
        align="end"
      >
        <DropdownMenuGroup className="bg-gray-50/60 p-4">
          <DropdownMenuLabel className="grid p-0 text-sm">
            <div className="font-medium" id="user-name">
              {user.name}
            </div>
            <div className="text-zinc-500">{user.email}</div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="m-0 bg-border" />
        {DROPDOWN_ITEMS.map((items, index) => (
          <Fragment key={index}>
            <DropdownMenuGroup className="p-2">
              {items.map((item, index) => (
                <DropDownItemWithIcon
                  onClick={item.onClick}
                  href={item.href}
                  key={index}
                  icon={item.icon}
                >
                  {item.label}
                </DropDownItemWithIcon>
              ))}
            </DropdownMenuGroup>
            {index !== DROPDOWN_ITEMS.length - 1 && (
              <DropdownMenuSeparator className="m-0 bg-border" />
            )}
          </Fragment>
        ))}
        <DropdownMenuGroup className="hidden p-2">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="items-center gap-2">
              <span>Theme</span>
              <span className="sr-only">Toggle theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {themes.map((theme) => (
                  <DropdownMenuItem
                    key={theme}
                    onClick={() => {
                      setTheme(theme);
                    }}
                  >
                    {capitalize(theme)}
                    {theme === currentTheme && (
                      <Check className="absolute right-2 h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
