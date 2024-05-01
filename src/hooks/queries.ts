import { useQuery } from "@tanstack/react-query";
import { getProjectById, getProjects } from "@/lib/actions";
import { Project } from "@/types";
import actionWrapper from "@/lib/actions/actionWrapper";

interface ProjectsQuery {
  initialData?: Project[];
}

export const ProjectsQueryKey = ["project-list"];

export function useProjects(options?: ProjectsQuery) {
  return useQuery({
    queryKey: ProjectsQueryKey,
    ...options,
    queryFn: async () => actionWrapper(getProjects()),
  });
}

export const SingleProjectQueryKey = (id: number) => ["project", id];

export function useSingleProject(id: number) {
  return useQuery({
    queryKey: SingleProjectQueryKey(id),
    queryFn: async () => actionWrapper(getProjectById(id)),
  });
}
