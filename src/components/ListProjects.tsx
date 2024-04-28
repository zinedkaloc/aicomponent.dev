"use client";
import Link from "next/link";
import { Project } from "@/types";
import { useMemo, useRef, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import DeleteProjectConfirmDialog from "@/components/DeleteProjectConfirmDialog";
import { cn, dateFormat } from "@/lib/utils";
import { useProjects } from "@/hooks/queries";

interface ListProjectsProps {
  initialData?: Project[];
}

export default function ListProjects({ initialData }: ListProjectsProps) {
  const { data: projects } = useProjects({
    initialData,
  });

  return projects?.map((project) => (
    <ProjectItem key={project.id} project={project} />
  ));
}

function calc(x: number) {
  return 10 / x / 10;
}

function ProjectItem({ project }: { project: Project }) {
  const scale = 0.4;
  const parentRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const [deleted, setDeleted] = useState(false);

  const parentWidth = useMemo(() => {
    return parentRef?.current?.getBoundingClientRect().width as number;
  }, [width, parentRef]);

  const parentHeight = useMemo(() => {
    return parentRef?.current?.getBoundingClientRect().height as number;
  }, [width, parentRef]);

  if (deleted) return null;

  return (
    <Link
      key={project.id}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-all"
      href={`/projects/${project.id}`}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="absolute right-2 top-2 z-10 hidden group-hover:block"
      >
        <DeleteProjectConfirmDialog
          onDelete={() => {
            setDeleted(true);
            console.log("deleted");
          }}
          project={project}
        />
      </div>
      <div
        ref={parentRef}
        className="relative aspect-video flex-1 overflow-hidden"
      >
        <iframe
          style={{
            width: `${parentWidth * calc(scale)}px`,
            height: `${parentHeight * calc(scale)}px`,
            transform: `scale(${scale})`,
          }}
          className={cn(
            "absolute origin-top-left select-none overflow-hidden bg-white",
            "pointer-events-none transition-opacity [content-visibility:auto]",
          )}
          loading="lazy"
          src={`/api/preview/${project.id}`}
        />
      </div>
      <div className="mt-auto flex items-center justify-between border-t p-4">
        <span
          title={project.prompt}
          className="max-w-[21ch] truncate text-gray-600 md:max-w-[24ch]"
        >
          {project.prompt}
        </span>
        <time className="whitespace-nowrap text-sm text-slate-500">
          {dateFormat(project.created_at)}
        </time>
      </div>
    </Link>
  );
}
