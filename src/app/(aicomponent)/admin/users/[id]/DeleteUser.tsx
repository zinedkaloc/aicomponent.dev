"use client";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { User } from "@/types";
import { deleteUser } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

interface DeleteUserProps {
  user: User;
  onDeleted?: () => void;
}

export default function DeleteUser({ user, onDeleted }: DeleteUserProps) {
  const [deleting, setDeleting] = useState(false);
  const { refresh } = useRouter();

  async function onConfirm() {
    try {
      setDeleting(true);
      await deleteUser(user.id);
      refresh();
      onDeleted?.();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <ConfirmDialog
        text="confirm delete user"
        onConfirm={onConfirm}
        trigger={
          <Button disabled={deleting} size="icon-sm" variant="destructive">
            <Trash />
          </Button>
        }
      />
    </div>
  );
}
