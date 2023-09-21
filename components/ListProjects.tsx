"use client";
import Link from "next/link";
import { Project } from "@/types";
import { useEffect, useMemo, useRef } from "react";
import useProjectList from "@/hooks/useProjectList";
import useProject from "@/hooks/useProject";
import { cn } from "@/utils/helpers";
import { useWindowSize } from "@uidotdev/usehooks";
import DeleteProjectConfirmDialog from "@/components/DeleteProjectConfirmDialog";

interface ListProjectsProps {
  projects?: Project[] | null;
}

export default function ListProjects({ projects }: ListProjectsProps) {
  const setProjects = useProjectList((state) => state.setProjects);
  const _projects = useProjectList((state) => state.projects);

  useEffect(() => {
    setProjects(projects ?? []);
  }, []);

  return <>{_projects?.map((project) => <ProjectItem project={project} />)}</>;
}

function ProjectItem({ project }: { project: Project }) {
  const scale = 0.4;
  const { setProject } = useProject();
  const parentRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  const parentWidth = useMemo(() => {
    return parentRef?.current?.getBoundingClientRect().width as number;
  }, [width, parentRef]);

  const parentHeight = useMemo(() => {
    return parentRef?.current?.getBoundingClientRect().height as number;
  }, [width, parentRef]);

  return (
    <Link
      key={project._id}
      className="flex group h-full flex-col relative overflow-hidden rounded-lg border bg-white transition-all"
      href={`/profile/projects/${project._id}`}
      onClick={() => setProject(project)}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="absolute hidden group-hover:block right-4 top-4 z-50"
      >
        <DeleteProjectConfirmDialog project={project} />
      </div>
      <div
        ref={parentRef}
        className="flex-1 aspect-video relative overflow-hidden"
      >
        <iframe
          style={{
            width: `${parentWidth * 2.5}px`,
            height: `${parentHeight * 2.5}px`,
            transform: `scale(${scale})`,
          }}
          className={cn(
            "absolute origin-top-left select-none overflow-hidden bg-white",
            "transition-opacity [content-visibility:auto] pointer-events-none",
          )}
          loading="lazy"
          src={`/api/preview/${project._id}`}
        />
      </div>
      <div className="flex mt-auto border-t justify-between items-center p-4">
        <span
          title={project.content}
          className="truncate max-w-[21ch] text-gray-600 md:max-w-[24ch]"
        >
          {project.content}
        </span>
        <time className="text-sm whitespace-nowrap text-slate-500">
          {new Date(project.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
    </Link>
  );
}
