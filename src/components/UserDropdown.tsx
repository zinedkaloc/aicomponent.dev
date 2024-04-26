"use client";
import { Component, Gem, ReceiptIcon, ShoppingCart, User } from "lucide-react";
import Popover from "@/components/Popover";
import Badge from "@/components/Badge";
import { useAuth } from "@/context/AuthContext";
import IconMenu from "@/components/IconMenu";
import LogoutIcon from "@/components/LogoutIcon";
import Link from "next/link";
import useSearchParams from "@/hooks/useSearchParams";
import UserAvatar from "@/components/UserAvatar";

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const { set } = useSearchParams();

  if (!user) return null;

  return (
    <Popover
      content={
        <div className="flex w-full flex-col space-y-px rounded-md bg-white p-3 sm:w-56">
          <div className="p-2">
            {user?.name && (
              <p className="truncate text-sm font-medium text-gray-900">
                {user?.name}
              </p>
            )}
            <p className="truncate text-sm text-gray-500">{user?.email}</p>
          </div>
          <div className="flex w-full justify-between rounded-md p-2 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
            <IconMenu text="Credits" icon={<Gem className="h-4 w-4" />} />
            <Badge
              text={user?.credits?.toString() ?? 0}
              variant={
                user?.credits === 0
                  ? "red"
                  : user.credits > 100
                    ? "green"
                    : "yellow"
              }
            />
          </div>
          <Popover.Item
            onClick={() => set("pricesModal", "true")}
            className="w-full rounded-md p-2 text-sm !outline-none transition-all duration-75 hover:bg-gray-100 active:bg-gray-200 sm:hidden"
          >
            <IconMenu
              text="Buy Credits"
              icon={<ShoppingCart className="h-4 w-4" />}
            />
          </Popover.Item>
          <Popover.Item asChild>
            <Link
              href="/profile/invoices"
              className="block w-full rounded-md p-2 text-sm !outline-none transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
            >
              <IconMenu
                text="Invoices"
                icon={<ReceiptIcon className="h-4 w-4" />}
              />
            </Link>
          </Popover.Item>
          <Popover.Item asChild>
            <Link
              href="/projects"
              className="block w-full rounded-md p-2 text-sm !outline-none transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
            >
              <IconMenu
                text="Components"
                icon={<Component className="h-4 w-4" />}
              />
            </Link>
          </Popover.Item>
          <Popover.Item asChild>
            <Link
              href="/profile"
              className="block w-full rounded-md p-2 text-sm !outline-none transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
            >
              <IconMenu text="Profile" icon={<User className="h-4 w-4" />} />
            </Link>
          </Popover.Item>
          <Popover.Item
            onClick={() => logout("/")}
            className="block w-full cursor-pointer rounded-md p-2 text-sm !outline-none transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
          >
            <IconMenu text="Logout" icon={<LogoutIcon className="h-4 w-4" />} />
          </Popover.Item>
        </div>
      }
      align="end"
    >
      <button>
        <UserAvatar />
      </button>
    </Popover>
  );
}
