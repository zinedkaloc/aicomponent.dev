"use client";
import useSearchParams from "@/hooks/useSearchParams";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";
import { useParams, usePathname } from "next/navigation";
import { cn, numberFormat } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Header() {
  const { set } = useSearchParams();
  const { user } = useAuth();
  const pathname = usePathname();
  const { id } = useParams();

  const isProjectPage = pathname.startsWith(`/projects/${id}`);

  function openAuthModal() {
    set("authModal", "true");
  }

  return (
    <header className="h-[--header-height] w-full border-b px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo href={isProjectPage ? `/projects` : "/"} />
        </div>
        <div
          className={cn(
            "flex items-center justify-center gap-3 sm:gap-4",
            user && "flex-row-reverse",
          )}
        >
          {user ? (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      className="select-none gap-1 font-medium"
                      variant={user.credits < 10 ? "destructive" : "default"}
                    >
                      <Coins size={12} />
                      {numberFormat(user.credits)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="bg-foreground text-xs text-background">
                    You have {numberFormat(user.credits)} credits left.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <UserAvatar withDropdown />
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="auth-btn rounded-full"
                onClick={openAuthModal}
              >
                Log in
              </Button>
              <Button
                variant="pill"
                size="sm"
                className="auth-btn "
                onClick={openAuthModal}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
