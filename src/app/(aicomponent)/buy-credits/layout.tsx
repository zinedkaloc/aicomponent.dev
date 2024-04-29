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
      <div className="mx-auto mb-8 mt-16 w-full max-w-screen-xl space-y-10 px-2.5 text-center lg:px-20">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-center text-4xl font-extrabold text-gray-900 sm:text-center">
            Support Our Mission
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-pretty text-center text-lg text-gray-500 sm:text-center">
            By choosing a plan, you’re not just building beautiful components —
            you’re becoming a cherished part of our journey and mission. Fuel
            our work so we can continue empowering your digital dreams. Every
            credit counts!
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
