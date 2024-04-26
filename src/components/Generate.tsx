"use client";

import { useDebounce } from "@uidotdev/usehooks";
import BrowserWindow from "@/components/BrowserWindow";
import { Button } from "@/components/ui/button";
import {
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
  const { user, setUser } = useAuth();
  const { replace } = useRouter();
  const { connected, realtime } = useSocket();

  useEffect(() => {
    console.log({ connected });
  }, [connected]);

  const { set, get, has, deleteByKey } = useSearchParams();

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

  const debounceContent = useDebounce(iframeContent, 300);

  useEffect(() => {
    if (!prompt) {
      return replace("/");
    }

    if (!connected) return;

    handleSubmit(new Event("submit") as unknown as FormEvent<HTMLFormElement>);
    deleteByKey("selected");
    if (!firstPrompt) setFirstPrompt(prompt);

    return () => {
      setPrompt(undefined);
    };
  }, [connected]);

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    stop,
    isLoading,
  } = useChat({
    body: {
      projectId,
      channelId,
    },
    initialInput: prompt,
    onResponse: (message) => {
      setHasNoCreditsError(false);
      decreaseCredit();
    },
    onFinish: async (message: Message) => {
      const subProjectId = sessionStorage.getItem("subProjectId")
        ? Number(sessionStorage.getItem("subProjectId"))
        : undefined;

      const projectId = sessionStorage.getItem("projectId")
        ? Number(sessionStorage.getItem("projectId"))
        : undefined;

      const id = subProjectId ?? projectId;
      try {
        const res = JSON.parse(message.content) as { credits: number };
        setCredits(res.credits);
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

  function onFocusHandler() {
    if (!user) {
      set("authModal", "true");
    }
  }

  function decreaseCredit(by: number = 1) {
    if (user) {
      setUser({ ...user, credits: user.credits - by });
    }
  }

  function setCredits(credits: number) {
    if (user) {
      setUser({ ...user, credits });
    }
  }

  const Form = (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
        deleteByKey("selected");
        if (!firstPrompt) setFirstPrompt(input);
      }}
      className={cn(
        "w-full",
        !firstPrompt && "mx-auto mb-4 sm:w-11/12 md:w-[800px]",
        firstPrompt && "flex w-full items-center justify-center",
      )}
    >
      <input
        className={cn(
          "text-ellipsis border p-2 px-4 transition focus:shadow-lg focus:outline-0",
          firstPrompt
            ? "w-full rounded-3xl bg-white/50 hover:border-black"
            : "mb-3 w-full rounded-full",
        )}
        value={input}
        placeholder={
          isLoading
            ? "Generating... "
            : firstPrompt
              ? "Say something to change design"
              : "Say something..."
        }
        onChange={user ? handleInputChange : undefined}
        onFocus={onFocusHandler}
        readOnly={!user}
        disabled={isLoading}
      />
    </form>
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
            <div className="grid w-full items-center gap-4 lg:h-[calc(100vh-160px)] lg:grid-cols-[300px_1fr_300px]">
              <div className="hidden lg:block" />
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
