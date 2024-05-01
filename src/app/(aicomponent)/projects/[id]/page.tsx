import ProjectDesign from "@/components/ProjectDesign";
import { env } from "@/env";
import { getProjectById } from "@/lib/actions";
import { notFound } from "next/navigation";
import actionWrapper from "@/lib/actions/actionWrapper";

export const dynamic = "force-dynamic";

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

  if (!project) {
    return notFound();
  }

  console.log(project.sub_projects);

  return (
    <div className="flex h-[--full-height] w-full flex-col items-center px-4 md:px-14">
      <ProjectDesign project={project} subProjects={project.sub_projects} />
    </div>
  );
}
