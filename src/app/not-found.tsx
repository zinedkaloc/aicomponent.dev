import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  return (
    <section className="fixed inset-0 bg-white">
      <div className="container mx-auto flex min-h-screen items-center px-6 py-12">
        <div>
          <p className="text-2xl font-medium text-blue-500">404 NOT FOUND</p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-800 md:text-4xl">
            We can’t find that page
          </h1>
          <p className="mt-4 text-gray-500">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>

          <div className="mt-6 flex items-center gap-x-3">
            <Link href="/">
              <Button variant="pill">Take me home</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
