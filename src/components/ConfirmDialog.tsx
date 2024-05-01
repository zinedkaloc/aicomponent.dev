"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { ReactNode, useState } from "react";

interface ConfirmDialogProps {
  text?: string;
  trigger: ReactNode;
  onConfirm: () => void;
  children?: ReactNode;
}

export default function ConfirmDialog({
  trigger,
  text,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState("");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="w-[95%] max-w-[450px] gap-0 overflow-hidden rounded-2xl border border-gray-100 p-0 shadow-xl">
        <AlertDialogCancel
          size="icon-sm"
          className="absolute right-4 top-4 z-50 [&>svg]:size-4"
        >
          <XIcon />
        </AlertDialogCancel>
        {children && (
          <div className="relative flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-8">
            {children}
          </div>
        )}

        {!text && (
          <div className="flex flex-col gap-y-6 p-5 text-left">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                project data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onConfirm} variant="destructive">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        )}

        {text && (
          <div className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-8">
            <div>
              <label
                htmlFor="verification"
                className="block text-sm text-gray-700"
              >
                To verify, type{" "}
                <span className="font-semibold text-black">{text}</span> below
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="text"
                  name="verification"
                  id="verification"
                  pattern="confirm delete account"
                  required
                  autoFocus={false}
                  autoComplete="off"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pr-10 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                />
              </div>
            </div>
            <AlertDialogAction asChild>
              {text && (
                <Button
                  disabled={confirmText.trim() !== text}
                  variant="destructive"
                  onClick={() => {
                    setConfirmText("");
                    onConfirm();
                  }}
                >
                  CONFIRM
                </Button>
              )}
            </AlertDialogAction>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
