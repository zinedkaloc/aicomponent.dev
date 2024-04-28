import { ReactNode } from "react";

export function generateMetadata() {
  return {
    title: "Buy Credits | AIComponent.dev",
    openGraph: {
      title: "Buy Credits | AIComponent.dev",
    },
  };
}

export default function CreditsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <div className="mx-auto mb-8 mt-16 w-full max-w-screen-xl px-2.5 text-center lg:px-20">
        {children}
      </div>
    </div>
  );
}
