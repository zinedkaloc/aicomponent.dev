import Link from "next/link";
import { Button } from "@/components/ui/button";
import ListProjects from "@/components/ListProjects";
import { cn } from "@/lib/utils";
import { actionWrapper, getProjects } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function ProfileProjects() {
  const projects = await actionWrapper(getProjects());
  const hasProjects = !!projects && projects.length > 0;

  return (
    <div className="flex h-full w-full flex-1 flex-col px-6 py-6">
      <div className={cn("w-full", !hasProjects && "flex flex-1 flex-col")}>
        <div
          className={cn(
            hasProjects
              ? "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
              : "flex flex-1 flex-col",
          )}
        >
          {!hasProjects ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-12">
              <h2 className="z-10 text-xl font-semibold text-gray-700">
                You don't have any components yet!
              </h2>
              <img
                alt="No links yet"
                loading="lazy"
                width={500}
                className="pointer-events-none blur-0"
                src="/no-project.png"
              />
              <Link href="/">
                <Button variant="pill">Create a component</Button>
              </Link>
            </div>
          ) : (
            <ListProjects initialData={projects} />
          )}
        </div>
      </div>
    </div>
  );
}
