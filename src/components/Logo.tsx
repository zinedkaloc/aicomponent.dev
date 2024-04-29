import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
}

export default function Logo({ href, className }: LogoProps) {
  const Component = href ? Link : "span";
  return (
    <Component
      href={href as string}
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
