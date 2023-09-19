import { fetchProjectById, fetchProjects } from "@/utils/auth";
import { SetProjects } from "@/hooks/useProjectList";
import { SetProject } from "@/hooks/useProject";
import dynamic from "next/dynamic";

const ProjectDesign = dynamic(() => import("@/components/ProjectDesign"), {
  ssr: false,
});

export default async function ProjectDetail({
  params,
}: {
  params: { id: string };
}) {
  const projects = await fetchProjects();
  const project = await fetchProjectById(params.id);
  return (
    <div className="mx-auto project-detail-page grid flex-1 w-full max-w-screen-2xl py-4 sm:py-6 px-2.5 lg:px-20">
      <SetProjects projects={projects ?? []} />
      <SetProject project={project ?? null} />
      <div className="h-full flex-1 grid">
        <div className="flex-1">
          {project?.result ? (
            <ProjectDesign project={project} />
          ) : (
            <div className="flex-1 h-full flex items-center justify-center text-gray-400">
              No HTML to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
