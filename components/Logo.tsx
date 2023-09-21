import Link from "next/link";

interface LogoProps {
  href?: string;
}

export default function Logo({ href }: LogoProps) {
  const Component = href ? Link : "span";
  return (
    <Component
      href={href as string}
      className="flex items-center tracking-tight text-lg sm:text-xl"
    >
      <strong className="font-bold">ai</strong>
      <span>component.dev</span>
    </Component>
  );
}
