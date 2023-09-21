import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { ProjectHistory } from "@/types";
import { cn } from "@/utils/helpers";

interface HistoryProps {
  projects: ProjectHistory[];
  className?: string;
}
export default function History({ projects, className }: HistoryProps) {
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
                <a
                  href={
                    project.isSubProject
                      ? `/api/preview/sub/${project.id}`
                      : `/api/preview/${project.id}`
                  }
                  target="_blank"
                  className="flex w-[200px] lg:w-full shrink-0 z-10 cursor-pointer relative"
                >
                  <div className="aspect-video w-full rounded-xl border overflow-hidden shadow-sm transition-colors [&_iframe]:hover:!opacity-100  hover:border-border">
                    <div className="relative w-full h-full overflow-hidden pointer-events-none">
                      <div className="absolute w-full h-full bg-transparent z-10" />
                      <iframe
                        loading="lazy"
                        className="absolute opacity-70 origin-top-left select-none overflow-hidden bg-white transition-opacity [transform:translateZ(1px)] [content-visibility:auto] w-full h-full pointer-events-none"
                        src={
                          project.isSubProject
                            ? `/api/preview/sub/${project.id}`
                            : `/api/preview/${project.id}`
                        }
                        sandbox="allow-scripts allow-same-origin"
                        style={{
                          width: 1000,
                          height: 555,
                          transform: "scale(0.2)",
                        }}
                      />
                    </div>
                  </div>
                </a>
              </TooltipTrigger>
              <TooltipContent side="left">{project.prompt}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
    </div>
  );
}
