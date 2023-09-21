"use client";

import Button from "@/components/Button";
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
  project: Project | null;
}) {
  const [deleting, setDeleting] = useState(false);
  const { refresh } = useRouter();
  const { deleteProject } = useProjectList();

  async function deleteProjectHandler() {
    if (!project) return;
    setDeleting(true);
    const res = await fetch("/api/project/" + project._id, {
      method: "DELETE",
    });
    const { errors } = await res.json();

    if (!errors) {
      deleteProject(project._id);
      refresh();
    } else setDeleting(false);
  }

  return (
    <ConfirmDialog
      text="confirm delete project"
      trigger={
        <Button
          variant="danger"
          className="px-2"
          disabled={deleting}
          type="button"
        >
          {deleting ? (
            <LoadingSpinner className="w-4 h-4" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      }
      onConfirm={deleteProjectHandler}
    />
  );
}
