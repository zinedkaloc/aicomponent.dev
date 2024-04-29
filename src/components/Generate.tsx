"use client";

import { useThrottle } from "@uidotdev/usehooks";
import BrowserWindow from "@/components/BrowserWindow";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  Check,
  Code2,
  Download,
  MonitorSmartphone,
  Share,
  Star,
} from "lucide-react";
import RateModal from "@/components/RateModal";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useSearchParams from "@/hooks/useSearchParams";
import { type Message, useChat } from "ai/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import NoCredits from "@/components/NoCredits";
import type { Project, ProjectHistory } from "@/types";
import History from "@/components/History";
import FirstPrompt from "@/components/FirstPrompt";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { cn, downloadHTML } from "@/lib/utils";
import { toast } from "sonner";
import { usePrompt } from "@/hooks/usePrompt";
import Spinner from "@/components/Spinner";
import useSocket from "@/hooks/useSocket";

const theme = githubGist;

export default function Generate() {
  const { refetchUser } = useAuth();
  const { replace } = useRouter();
  const { connected, realtime } = useSocket();
  const { get, has, deleteByKey } = useSearchParams();

  const channelId = usePrompt((state) => state.channelId);
  const prompt = usePrompt((state) => state.prompt);
  const setPrompt = usePrompt((state) => state.setPrompt);

  const [hasNoCreditsError, setHasNoCreditsError] = useState(false);
  const [firstPrompt, setFirstPrompt] = useState<null | string>(null);
  const [codeViewActive, setCodeViewActive] = useState(false);
  const [iframeContent, setIframeContent] = useState<string>();
  const [projectId, setProjectId] = useState<number>();
  const [subProjectId, setSubProjectId] = useState<number>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [history, setHistory] = useState<ProjectHistory[]>([]);

  const [copied, setCopied] = useState(false);
  const [finished, setFinished] = useState(false);
  const [rated, setRated] = useState(false);
  const selected = Number(get("selected") ?? 0);

  const debounceContent = useThrottle(iframeContent, 400);

  useEffect(() => {
    if (!connected || !prompt) return;

    handleSubmit(new Event("submit") as unknown as FormEvent<HTMLFormElement>);
    deleteByKey("selected");
    if (!firstPrompt) setFirstPrompt(prompt);

    return () => {
      setPrompt(undefined);
    };
  }, [connected, prompt]);

  useEffect(() => {
    if (!prompt) {
      return replace("/");
    }

    return () => {
      setPrompt(undefined);
    };
  }, []);

  const { messages, input, setInput, handleSubmit, stop, isLoading } = useChat({
    body: {
      projectId,
      channelId,
    },
    initialInput: prompt,
    onResponse: (message) => {
      setHasNoCreditsError(false);
    },
    onFinish: async (message: Message) => {
      refetchUser();
      const subProjectId = sessionStorage.getItem("subProjectId")
        ? Number(sessionStorage.getItem("subProjectId"))
        : undefined;

      const projectId = sessionStorage.getItem("projectId")
        ? Number(sessionStorage.getItem("projectId"))
        : undefined;

      const id = subProjectId ?? projectId;
      try {
        const res = JSON.parse(message.content) as { credits: number };
        setHasNoCreditsError(res.credits === 0);
      } catch {
        setHistory((projects) => {
          return projects.map((project) => {
            if (project.id === id) {
              return { ...project, ready: true, result: message.content };
            }
            return project;
          });
        });
      }
    },
  });

  async function share() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/projects/${projectId}?selected=${selected}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL to clipboard");
      setCopied(false);
    }
  }

  useEffect(() => {
    if (!channelId) return;

    sessionStorage.clear();
    realtime.join(channelId);
    realtime.onConnect(onConnectHandler);

    return () => {
      realtime.off("project", realtimeHandler);
      realtime.offAny(onConnectHandler);
      realtime.leave(channelId);
    };
  }, [channelId]);

  function onConnectHandler() {
    console.log("connected");
    realtime.on("project", realtimeHandler);
  }

  function realtimeHandler({ message }: { message: Project }) {
    console.log(message);
    if (message.parent) {
      setSubProjectId(message.id);
      sessionStorage.setItem("subProjectId", message.id.toString());
    } else {
      setProjectId(message.id);
      sessionStorage.setItem("projectId", message.id.toString());
    }

    setHistory((prev) => {
      return [
        ...prev,
        {
          id: message.id,
          prompt: message.prompt,
          ready: false,
          isSubProject: !!message.parent,
        },
      ];
    });
  }

  useEffect(() => {
    const lastProject = history[history.length - 1];
    if (!lastProject || !lastProject?.ready) return;

    setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("selected", `${history.length - 1}`);
      replace(`?${params.toString()}`);
    }, 1000);
  }, [history]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role !== "user") {
      setIframeContent(lastMessage.content);
    }
  }, [messages]);

  useEffect(() => {
    if (!iframeRef.current) return;
    iframeRef.current.contentDocument?.open();
    iframeRef.current.contentDocument?.write(debounceContent?.toString() ?? "");
    iframeRef.current.contentDocument?.close();
  }, [debounceContent, iframeRef.current]);

  const handleSave = () => {
    if (iframeContent) downloadHTML(iframeContent);
  };

  const Form = (
    <>
      <div className="flex min-h-[3rem] items-center justify-center gap-2 overflow-hidden rounded-xl border bg-transparent px-2 transition focus-within:ring-0 focus-visible:ring-transparent [&:has(input:focus)]:border-black">
        <div className="flex min-h-[3rem] min-w-0 flex-1 items-center self-end">
          <form
            className="w-full"
            onSubmit={(e) => {
              handleSubmit(e);
              deleteByKey("selected");
              if (!firstPrompt) setFirstPrompt(input);
            }}
          >
            <div className="relative flex h-fit min-h-full w-full items-center transition-all duration-300">
              <label htmlFor="prompt" className="sr-only">
                Prompt
              </label>
              <div className="relative flex min-w-0 flex-1 self-start">
                <input
                  maxLength={1000}
                  className="min-h-[3rem] min-w-[50%] flex-[1_0_50%] resize-none border-none bg-transparent py-3 pl-3 pr-4 text-base scrollbar-hide focus-visible:outline-none disabled:opacity-80 sm:min-h-[15px] sm:leading-6 md:text-sm"
                  spellCheck="false"
                  autoComplete="off"
                  value={input}
                  disabled={isLoading}
                  placeholder={
                    isLoading
                      ? "Generating..."
                      : "Say something to change design"
                  }
                  onChange={(event) => setInput(event.target.value)}
                  style={{ boxShadow: "none" }}
                />
              </div>

              <Button type="submit" size="icon-sm" className="rounded-lg">
                <span className="sr-only">Send</span>
                {isLoading ? (
                  <Spinner className="!size-4" />
                ) : (
                  <ArrowUp className="!size-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  function stopGeneration() {
    const id = Number(subProjectId ?? projectId);
    stop();
    setHistory((prev) => {
      return prev.filter((p) => p.id !== id);
    });
  }

  const HeaderButtons = (
    <div className="lg:max-w-auto flex items-center gap-2">
      {isLoading && (
        <Button
          size="xs"
          variant="light"
          onClick={stopGeneration}
          className="gap-2 whitespace-nowrap px-3 py-1"
        >
          <Spinner />
          Stop generation
        </Button>
      )}

      {finished && !rated && selected === 0 && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                size="xs"
                variant="light"
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set("rateModal", "true");
                  replace(`?${params.toString()}`);
                }}
                className="aspect-square gap-2 whitespace-nowrap p-1"
              >
                <Star />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rate your experience</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {history.some((p) => p.ready) && (
        <Button
          variant="light"
          size="xs"
          className="gap-2 whitespace-nowrap px-3 py-1"
          onClick={share}
        >
          {copied ? (
            <>
              <Check />
              Copied
            </>
          ) : (
            <>
              <Share />
              Share
            </>
          )}
        </Button>
      )}
      <Button
        size="xs"
        variant="light"
        className="gap-2 whitespace-nowrap px-3 py-1"
        onClick={() => setCodeViewActive(!codeViewActive)}
      >
        {codeViewActive ? (
          <>
            <MonitorSmartphone />
            Display
          </>
        ) : (
          <>
            <Code2 />
            Code
          </>
        )}
      </Button>
      <Button
        size="xs"
        variant="light"
        className="aspect-square gap-2 p-1"
        onClick={handleSave}
      >
        <Download />
      </Button>
    </div>
  );

  const selectedComponent = useMemo(() => {
    return {
      url: selected === 0 ? "/api/preview/" : `/api/preview/sub/`,
      id: history[selected]?.id,
      result: history[selected]?.result,
    };
  }, [history, selected]);

  return (
    <>
      <div
        className={cn(
          "flex min-h-[calc(100vh-72px)] w-full flex-col",
          "items-center overflow-hidden",
          "px-4 pt-6 md:px-14",
        )}
      >
        {hasNoCreditsError && <NoCredits />}

        {!hasNoCreditsError && (
          <section className="w-full space-y-2">
            {firstPrompt && <FirstPrompt firstPrompt={firstPrompt} />}
            <div className="grid w-full gap-4 lg:h-[calc(100vh-160px)] lg:grid-cols-[300px_1fr_300px]">
              <div className="hidden md:block" />
              <div className="grid h-[calc(100vh-160px)] w-full grid-rows-[1fr_auto] space-y-2.5">
                <BrowserWindow
                  contentClassName="bg-white overflow-auto"
                  header={HeaderButtons}
                >
                  <SyntaxHighlighter
                    language="htmlbars"
                    style={theme}
                    showLineNumbers
                    className={cn(codeViewActive ? "!block" : "!hidden")}
                  >
                    {has("selected")
                      ? (selectedComponent?.result as string)
                      : iframeContent ?? ""}
                  </SyntaxHighlighter>
                  <iframe
                    ref={iframeRef}
                    className={cn(
                      "h-full w-full",
                      !codeViewActive ? "block" : "hidden",
                    )}
                  />
                </BrowserWindow>
                {Form}
              </div>
              <History
                onClick={(index) => replace(`?selected=${index}`)}
                projects={history}
              />
            </div>
          </section>
        )}
      </div>
      <RateModal key={projectId} onRateSubmit={() => setRated(true)} />
    </>
  );
}
