"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp, CircleAlert, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";
import { usePrompt } from "@/hooks/usePrompt";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import useSearchParams from "@/hooks/useSearchParams";

interface Props {
  className?: string;
}

let toastId: string | number;

export default function SubmissionForm(props: Props) {
  const { user } = useAuth();
  const [loading, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const { set } = useSearchParams();
  const setPrompt = usePrompt((state) => state.setPrompt);
  const generateChannelId = usePrompt((state) => state.generateChannelId);
  const prompt = usePrompt((state) => state.prompt);

  const { push } = useRouter();

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    generateChannelId();
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return set("authModal", "true");
    }

    if (prompt?.trim()?.length === 0 || !user) return;

    if (user?.credits < 5) {
      toast.dismiss(toastId);
      toastId = toast.error(
        <div className="flex w-fit gap-2">
          <CircleAlert className="mt-1 size-5" />
          <div>
            You do not have enough credits to generate. <br />
            <Link target="_blank" className="underline" href="/buy-credits">
              Buy credits
            </Link>
          </div>
        </div>,
        {
          className: "w-fit",
        },
      );
      return;
    }

    startTransition(() => {
      push(`/start-building`);
    });
  }

  const examples = ["A product card", "A contact form", "A navigation menu"];

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2",
        props?.className,
      )}
    >
      <div className="w-full max-w-xl space-y-1">
        <div className="flex min-h-[3rem] items-center justify-center gap-2 overflow-hidden rounded-xl border bg-transparent px-2 transition focus-within:ring-0 focus-visible:ring-transparent [&:has(input:focus)]:border-black">
          <div className="flex min-h-[3rem] min-w-0 flex-1 items-center self-end">
            <form onSubmit={onSubmit} className="h-full w-full">
              <div className="relative flex h-fit min-h-full w-full items-center transition-all duration-300">
                <label htmlFor="prompt" className="sr-only">
                  Prompt
                </label>
                <div className="relative flex min-w-0 flex-1 self-start">
                  <input
                    ref={inputRef}
                    id="prompt"
                    maxLength={1000}
                    className="min-h-[3rem] min-w-[50%] flex-[1_0_50%] resize-none border-none bg-transparent py-3 pl-3 pr-4 text-base scrollbar-hide focus-visible:outline-none disabled:opacity-80 sm:min-h-[15px] sm:leading-6 md:text-sm"
                    spellCheck="false"
                    autoComplete="off"
                    value={prompt}
                    placeholder="A login form with social providers"
                    onChange={(event) => setPrompt(event.target.value)}
                    style={{ boxShadow: "none" }}
                  />
                </div>

                <Button type="submit" size="icon-sm" className="rounded-lg">
                  <span className="sr-only">Send</span>
                  {loading ? (
                    <Spinner className="!size-4" />
                  ) : (
                    <ArrowUp className="!size-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="px-2 text-muted-foreground">
          <small>Describe your desired component in a few words.</small>
        </div>
      </div>
      <div className="top-full flex max-w-full flex-wrap items-center justify-center gap-0.5 whitespace-nowrap text-sm sm:gap-2">
        {examples.map((example, index) => (
          <Button
            size="xs"
            variant="ghost"
            key={index}
            onClick={() => {
              setPrompt(example);
              inputRef.current?.focus();
            }}
            className={cn(
              "inline-flex select-none items-center gap-1 whitespace-nowrap rounded-full border border-zinc-200 px-2 py-0.5 !text-[9px] transition-colors hover:border-zinc-800 sm:!text-xs",
            )}
          >
            {example}
            <MoveUpRight size={12} />
          </Button>
        ))}
      </div>
    </div>
  );
}
