import fetchSubProjectByParentId, {
  fetchProjectById,
  fetchProjects,
} from "@/utils/auth";
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
  const subProjects = await fetchSubProjectByParentId(params.id);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] items-center px-4 md:px-16 lg:px-24 pt-6">
      <SetProjects projects={projects ?? []} />
      <SetProject project={project ?? null} />
      {project?.result ? (
        <ProjectDesign project={project} subProjects={subProjects} />
      ) : (
        <div className="flex-1 h-full flex items-center justify-center text-gray-400">
          No HTML to display
        </div>
      )}
    </div>
  );
}
