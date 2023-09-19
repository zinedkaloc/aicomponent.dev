"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Badge, { BadgeVariant } from "@/components/Badge";
import { Project } from "@/types";
import ProjectIcon from "@/components/ProjectIcon";
import { useEffect } from "react";
import useProjectList from "@/hooks/useProjectList";
import useProject from "@/hooks/useProject";

const mails = [
  "ozgurozalp1999@gmail.com",
  "mail@ozgurozalp.com",
  "denizlevregi7@gmail.com",
  "umit@altogic.com",
  "umit.cakmak@altogic.com",
];

interface ListProjectsProps {
  projects?: Project[] | null;
}

export default function ListProjects({ projects }: ListProjectsProps) {
  const { user } = useAuth();
  const { setProject } = useProject();
  const setProjects = useProjectList((state) => state.setProjects);
  const _projects = useProjectList((state) => state.projects);

  const hasPermission = mails.includes(user?.email as string);
  const Component = hasPermission ? Link : "div";

  useEffect(() => {
    setProjects(projects ?? []);
  }, []);

  return (
    <>
      {_projects?.map((project) => (
        <Component
          key={project._id}
          className="flex h-full flex-col space-y-10 rounded-lg border border-gray-100 bg-white p-4 sm:p-6 transition-all"
          href={`/profile/projects/${project._id}`}
          onClick={() => setProject(project)}
        >
          <div className="flex flex-1 items-start justify-between gap-1">
            <div className="flex space-x-3 flex-1">
              <ProjectIcon className="shrink-0 self-start" />
              <div className="flex-1">
                <h2 className="text-lg leading-[1.2] font-medium text-gray-700">
                  {project?.name ?? project?.content}
                </h2>
                <div className="flex items-center"></div>
              </div>
            </div>
            <Badge
              variant={badgeMap[project.status ?? "draft"]}
              text={project.status ?? "draft"}
            />
          </div>
          <div className="flex mt-auto items-center space-x-4"></div>
        </Component>
      ))}
    </>
  );
}

const badgeMap: Record<string, BadgeVariant> = {
  draft: "black",
  live: "green",
};
