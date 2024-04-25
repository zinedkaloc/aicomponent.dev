"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Project } from "@/types";
import { useEffect } from "react";

interface ProjectList {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  updateProject: (id: number, project: Project) => void;
  deleteProject: (id: number) => void;
}

const useProjectList = create<ProjectList>()(
  devtools(
    (set) => ({
      projects: [],
      setProjects: (projects) => set({ projects }),
      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? project : p)),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
    }),
    {
      name: "project-list-storage",
    },
  ),
);

export function SetProjects({ projects }: { projects: Project[] }) {
  useEffect(() => {
    useProjectList.setState({ projects });
  }, []);

  return <></>;
}

export default useProjectList;
