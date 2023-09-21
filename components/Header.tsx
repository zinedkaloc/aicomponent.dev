"use client";
import useSearchParams from "@/hooks/useSearchParams";
import { useAuth } from "@/context/AuthContext";
import UserDropdown from "@/components/UserDropdown";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import ProjectSelect from "@/components/ProjectSelect";
import Divider from "@/components/Divider";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/utils/helpers";
import TwitterLogo from "@/components/TwitterLogo";

export default function Header() {
  const { set } = useSearchParams();
  const { user } = useAuth();
  const pathname = usePathname();
  const { id } = useParams();

  const isProjectPage = pathname.startsWith(`/profile/projects/${id}`);

  function openAuthModal() {
    set("authModal", "true");
  }

  function openPricesModal() {
    set("pricesModal", "true");
  }

  return (
    <header className="w-full px-6 h-[72px]">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center gap-2">
          <Logo href={isProjectPage ? `/profile/projects` : "/"} />
        </div>
        <div
          className={cn(
            "flex items-center justify-center gap-3 sm:gap-4",
            user ? "flex-row-reverse" : "",
          )}
        >
          {user ? (
            <UserDropdown />
          ) : (
            <div className="flex">
              <button
                className="auth-btn rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors ease-out hover:text-black"
                onClick={openAuthModal}
              >
                Log in
              </button>
              <button
                className="auth-btn rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={openAuthModal}
              >
                Sign Up
              </button>
            </div>
          )}
          <a
            href="https://twitter.com/aipagedev"
            className="hidden sm:flex items-center text-gray-900 hover:text-blue-500 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            <TwitterLogo className="h-5 w-5 fill-current" />
          </a>
          {user && (
            <Button
              className="auth-btn hidden sm:block"
              variant="pill"
              onClick={openPricesModal}
            >
              Buy Credits 🎉
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
