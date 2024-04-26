"use client";
import useSearchParams from "@/hooks/useSearchParams";
import { useAuth } from "@/context/AuthContext";
import UserDropdown from "@/components/UserDropdown";
import Logo from "@/components/Logo";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { set } = useSearchParams();
  const { user } = useAuth();
  const pathname = usePathname();
  const { id } = useParams();

  const isProjectPage = pathname.startsWith(`/projects/${id}`);

  function openAuthModal() {
    set("authModal", "true");
  }

  function openPricesModal() {
    set("pricesModal", "true");
  }

  return (
    <header className="w-full border-b px-6">
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
            <UserDropdown />
          ) : (
            <div className="flex gap-0.5">
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
                className="auth-btn"
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
