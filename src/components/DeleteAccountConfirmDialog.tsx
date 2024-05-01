"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteProfile } from "@/lib/actions";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import actionWrapper from "@/lib/actions/actionWrapper";

export default function DeleteAccountConfirmDialog() {
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();

  async function deleteAccountHandler() {
    try {
      setDeleting(true);
      await actionWrapper(deleteProfile());
      window.location.href = "/";
    } catch (errors) {
      console.log(errors);
      toast.error("Failed to delete account, please try again.");
    } finally {
      setDeleting(false);
    }
  }

  if (!user) return null;

  return (
    <ConfirmDialog
      text="confirm delete account"
      trigger={
        <Button variant="destructive" disabled={deleting} type="button">
          {deleting && <Spinner />}
          <p>Delete Account</p>
        </Button>
      }
      onConfirm={deleteAccountHandler}
    >
      <Avatar className="size-20">
        <AvatarImage src={user.profile_picture} />
        <AvatarFallback>
          {user.name
            .split(" ")
            .map((name) => name[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <h3 className="text-lg font-medium">Delete Account</h3>
      <p className="text-center text-sm text-gray-500">
        Warning: This will permanently delete your account and all your data.
      </p>
    </ConfirmDialog>
  );
}
