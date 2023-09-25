import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { ProjectHistory } from "@/types";
import { cn } from "@/utils/helpers";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useRef } from "react";
import Skeleton from "@/components/Skeleton";

interface HistoryProps {
  projects: ProjectHistory[];
  className?: string;
  onClick?: (index: number) => void;
}
export default function History({
  projects,
  onClick,
  className,
}: HistoryProps) {
  const historyRef = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => {
    if (path === "/") {
      setTimeout(() => {
        historyRef.current?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
    }
  }, [projects, path]);

  return (
    <div
      ref={historyRef}
      className={cn(
        "flex mb-4 lg:mb-0 lg:flex-col gap-2 lg:h-[calc(100vh-160px)] overflow-auto",
        className,
      )}
    >
      {projects.map((project, index) => (
        <HistoryItem
          onClick={onClick}
          index={index}
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}

function HistoryItem({
  project,
  onClick,
  index,
}: {
  project: ProjectHistory;
  onClick?: (index: number) => void;
  index: number;
}) {
  const searchParams = useSearchParams();
  const Component = onClick ? "button" : "a";

  return (
    <Fragment>
      {project.ready && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Component
                onClick={() => onClick?.(index)}
                href={
                  onClick
                    ? undefined
                    : project.isSubProject
                    ? `/api/preview/sub/${project.id}`
                    : `/api/preview/${project.id}`
                }
                target="_blank"
                className={cn(
                  "flex w-[200px] lg:w-full shrink-0 z-10 cursor-pointer relative",
                )}
              >
                <div
                  className={cn(
                    "aspect-video w-full rounded-xl border overflow-hidden shadow-sm transition-colors [&_iframe]:hover:!opacity-100 hover:border-border",
                    Number(searchParams.get("selected") ?? 0) === index &&
                      "border-gray-500",
                  )}
                >
                  <div className="relative w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute w-full h-full bg-transparent z-10" />
                    <iframe
                      loading="lazy"
                      className="absolute opacity-70 scale-[0.2] lg:scale-[0.3] origin-top-left select-none overflow-hidden bg-white transition-opacity [content-visibility:auto] w-full h-full pointer-events-none"
                      src={
                        project.isSubProject
                          ? `/api/preview/sub/${project.id}`
                          : `/api/preview/${project.id}`
                      }
                      sandbox="allow-scripts allow-same-origin"
                      style={{
                        width: 1000,
                        height: 555,
                      }}
                    />
                  </div>
                </div>
              </Component>
            </TooltipTrigger>
            <TooltipContent side="left">{project.prompt}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {!project.ready && (
        <div className="aspect-video shrink-0 px-2 w-full rounded-xl border overflow-hidden shadow-sm flex gap-2 flex-col justify-center">
          <Skeleton className="h-5 w-[25%] bg-gray-100" />
          <Skeleton className="h-5 w-[75%] bg-gray-100" />
          <Skeleton className="h-5 w-[50%] bg-gray-100" />
          <Skeleton className="h-5 w-full bg-gray-100" />
        </div>
      )}
    </Fragment>
  );
}
