import fetchSubProjectByParentId, {
  fetchProjectById,
  fetchProjects,
} from "@/utils/auth";
import { SetProjects } from "@/hooks/useProjectList";
import { SetProject } from "@/hooks/useProject";
import ProjectDesign from "@/components/ProjectDesign";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata({ params }: Props) {
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_DOMAIN ?? "http://localhost:3000",
    ),
    openGraph: {
      images: `/api/og/${params.id}`,
    },
  };
}

export default async function ProjectDetail({ params }: Props) {
  const projects = await fetchProjects();
  const project = await fetchProjectById(params.id);
  const subProjects = await fetchSubProjectByParentId(params.id);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] items-center px-4 md:px-14 pt-6">
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
