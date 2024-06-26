"use client";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/actions/admin";
import { useAuth } from "@/context/AuthContext";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import actionWrapper from "@/lib/actions/actionWrapper";
import { APIError } from "@agnost/client";

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
      await actionWrapper(updateUser(user.id, JSON.parse(data)));
      toast.success("User updated successfully");
      refresh();
      if (authUser?.id === user.id) {
        refetchUser();
      }
    } catch (error: unknown) {
      const APIError = error as APIError;

      const zodErrors = APIError.items.find(
        (item) => item.code === "zod_error",
      )?.details;

      if (!zodErrors) {
        toast.error("Failed to update user");
      } else {
        const { fieldErrors } = zodErrors as {
          fieldErrors: Record<string, string>;
        };
        const [error] = Object.values(fieldErrors);
        if (error) toast.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-2 p-4">
      <h2>
        Update user: {user.name}{" "}
        <span className="font-bold">({user.email})</span>
      </h2>
      <form onSubmit={handleSubmit} className="flex h-full flex-col gap-2">
        <CodeMirror
          value={data}
          onChange={(editor) => setData(editor)}
          className="overflow-hidden rounded border"
          theme={xcodeLight}
          extensions={[json()]}
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
