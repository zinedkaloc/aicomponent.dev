import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { ProjectHistory } from "@/types";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useRef } from "react";
import Skeleton from "@/components/Skeleton";
import { TooltipArrow } from "@radix-ui/react-tooltip";

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
        "mb-4 flex gap-2 overflow-auto lg:mb-0 lg:h-[calc(100vh-160px)] lg:flex-col",
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
                href={onClick ? undefined : `/api/preview/${project.id}`}
                target="_blank"
                className={cn(
                  "relative z-10 flex w-[200px] shrink-0 cursor-pointer lg:w-full",
                )}
              >
                <div
                  className={cn(
                    "aspect-video w-full overflow-hidden rounded-xl border shadow-sm transition-colors hover:border-border [&_iframe]:hover:!opacity-100",
                    Number(searchParams.get("selected") ?? 0) === index &&
                      "border-gray-500",
                  )}
                >
                  <div className="pointer-events-none relative h-full w-full overflow-hidden">
                    <div className="absolute z-10 h-full w-full bg-transparent" />
                    <iframe
                      loading="lazy"
                      className="pointer-events-none absolute h-full w-full origin-top-left scale-[0.2] select-none overflow-hidden bg-white opacity-70 transition-opacity [content-visibility:auto] lg:scale-[0.3]"
                      src={`/api/preview/${project.id}`}
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

            <TooltipContent side="left">
              {project.prompt}
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {!project.ready && (
        <div className="flex aspect-video w-full shrink-0 flex-col justify-center gap-2 overflow-hidden rounded-xl border px-2 shadow-sm">
          <Skeleton className="h-5 w-[25%] bg-gray-100" />
          <Skeleton className="h-5 w-[75%] bg-gray-100" />
          <Skeleton className="h-5 w-[50%] bg-gray-100" />
          <Skeleton className="h-5 w-full bg-gray-100" />
        </div>
      )}
    </Fragment>
  );
}
