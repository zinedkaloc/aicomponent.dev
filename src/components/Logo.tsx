"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePrompt } from "@/hooks/usePrompt";

interface LogoProps {
  href?: string;
  className?: string;
}

export default function Logo({ href, className }: LogoProps) {
  const Component = href ? Link : "span";
  const { setPrompt } = usePrompt();
  return (
    <Component
      href={href as string}
      onClick={() => setPrompt(undefined)}
      className={cn(
        "flex items-center text-lg tracking-tight sm:text-xl",
        className,
      )}
    >
      <strong className="font-bold">ai</strong>
      <span>component.dev</span>
    </Component>
  );
}
