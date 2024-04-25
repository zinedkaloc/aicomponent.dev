"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingSpinner from "@/components/loadingSpinner";
import { Project } from "@/types";
import { useRouter } from "next/navigation";
import useProjectList from "@/hooks/useProjectList";
import { Trash } from "lucide-react";

export default function DeleteProjectConfirmDialog({
  project,
}: {
  project: Project;
}) {
  const [deleting, setDeleting] = useState(false);
  const { refresh } = useRouter();
  const { deleteProject } = useProjectList();

  async function deleteProjectHandler() {
    if (!project) return;
    setDeleting(true);
    const res = await fetch("/api/project/" + project.id, {
      method: "DELETE",
    });
    const { errors } = await res.json();

    if (!errors) {
      deleteProject(project.id);
      refresh();
    } else setDeleting(false);
  }

  return (
    <ConfirmDialog
      trigger={
        <Button
          variant="destructive"
          className="px-2"
          size="icon-sm"
          disabled={deleting}
          type="button"
        >
          {deleting ? (
            <LoadingSpinner className="h-4 w-4" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      }
      onConfirm={deleteProjectHandler}
    />
  );
}
