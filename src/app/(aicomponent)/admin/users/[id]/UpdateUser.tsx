"use client";
import { User } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/actions/admin";
import { useAuth } from "@/context/AuthContext";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UpdateUser({ user }: { user: User }) {
  const { user: authUser, refetchUser } = useAuth();
  const { refresh } = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(
    JSON.stringify(deleteObjectKey(user, "id"), null, 4),
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data) return;

    try {
      setLoading(true);
      await updateUser(user.id, JSON.parse(data));
      toast.success("User updated successfully");
      refresh();
      if (authUser?.id === user.id) {
        refetchUser();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto h-[--full-height] max-w-4xl space-y-2 py-4">
      <h2>
        Update user: {user.name}{" "}
        <span className="font-bold">({user.email})</span>
      </h2>
      <form onSubmit={handleSubmit} className="flex h-full flex-col gap-2">
        <input type="number" className="hidden" name="id" value={user.id} />
        <Textarea
          name="user"
          className="h-fit"
          rows={9}
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <div className="flex justify-end">
          <Button disabled={loading} type="submit">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}

function deleteObjectKey(obj: Record<string, any>, key: string) {
  const { [key]: _, ...rest } = obj;
  return rest;
}
