import ProjectDesign from "@/components/ProjectDesign";
import { env } from "@/env";
import { actionWrapper, getProjectById } from "@/lib/actions";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata({ params }: Props) {
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_DOMAIN),
    openGraph: {
      images: `/api/og/${params.id}`,
    },
  };
}

export default async function ProjectDetail({ params }: Props) {
  const project = await actionWrapper(getProjectById(+params.id));

  return (
    <div className="flex min-h-[--full-height] w-full flex-col items-center px-4 pt-6 md:px-14">
      {project?.result ? (
        <ProjectDesign project={project} subProjects={[]} />
      ) : (
        <div className="flex h-full flex-1 items-center justify-center text-gray-400">
          No HTML to display
        </div>
      )}
    </div>
  );
}
