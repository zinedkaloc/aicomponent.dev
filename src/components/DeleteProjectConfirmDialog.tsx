"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Project } from "@/types";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import Spinner from "@/components/Spinner";
import { actionWrapper, deleteProject } from "@/lib/actions";
import { toast } from "sonner";

let toastId: any;

export default function DeleteProjectConfirmDialog({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const { refresh } = useRouter();

  async function deleteProjectHandler() {
    if (!project) return;
    setDeleting(true);
    try {
      await actionWrapper(deleteProject(project.id));
      onDelete();
      toast.dismiss(toastId);
      toastId = toast.success("Project deleted successfully", {
        duration: 1000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    } finally {
      refresh();
      setDeleting(false);
    }
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
            <Spinner className="h-4 w-4" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      }
      onConfirm={deleteProjectHandler}
    />
  );
}
