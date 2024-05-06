"use client";

import { capitalize } from "@/lib/utils";
import Link from "next/link";
import Logo from "./Logo";
import Container from "./ui/container";

const navigation = {
  pricing: [{ name: "Credits", href: "/buy-credits" }],
  help: [
    { name: "Support", href: "/support" },
    { name: "Feedback", href: "/feedback" },
  ],
  legal: [
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
  ],
};

export default function AppFooter() {
  return (
    <footer className="z-10 border-t border-gray-200 bg-white/50 py-8 backdrop-blur-lg">
      <Container className="pt-10">
        <div className="xl:grid xl:grid-cols-5 xl:gap-8">
          <div className="space-y-8 xl:col-span-2">
            <Link href="/">
              <span className="sr-only">AIComponent Logo</span>
              <Logo className="h-5" />
            </Link>
            <p className="max-w-xs text-sm text-gray-500">
              Create UI components with speed and ease with the help of AI.
            </p>
          </div>
          <div className="mt-16 grid gap-8 xl:col-span-3 xl:mt-0">
            <div className="flex w-full grid-cols-3 justify-between gap-8 sm:mx-0 sm:grid sm:w-auto">
              {Object.entries(navigation).map(([key, value]) => (
                <div className="" key={key}>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {capitalize(key)}
                  </h3>
                  <ul role="list" className="mt-4 space-y-4">
                    {value.map((item) => (
                      <li key={item.name} className="">
                        <Link
                          href={item.href}
                          className="text-sm text-gray-500 hover:text-gray-900"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-sm leading-5 text-gray-500">
            © {new Date().getFullYear()} AIComponent. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
