import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { ProjectHistory } from "@/types";
import { cn } from "@/utils/helpers";
import { useSearchParams } from "next/navigation";

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
  const Component = onClick ? "button" : "a";
  const searchParams = useSearchParams();

  return (
    <div
      className={cn(
        "flex mb-4 lg:mb-0 lg:flex-col gap-2 lg:h-[calc(100vh-160px)] overflow-auto",
        className,
      )}
    >
      {projects
        .filter((project) => project.ready)
        .map((project, i) => (
          <TooltipProvider key={i}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Component
                  onClick={() => onClick?.(i)}
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
                      Number(searchParams.get("selected") ?? 0) === i &&
                        "border-black",
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
        ))}
    </div>
  );
}
