"use client";

import BrowserWindow from "@/components/BrowserWindow";
import LoadingSpinner from "@/components/loadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Check,
  Code2,
  Download,
  MonitorSmartphone,
  Plus,
  Star,
  Share,
} from "lucide-react";
import RateModal from "@/components/RateModal";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useSearchParams from "@/hooks/useSearchParams";
import { type Message, useChat } from "ai/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Hero from "@/components/Hero";
import NoCredits from "@/components/NoCredits";
import type { ProjectHistory } from "@/types";
import History from "@/components/History";
import FirstPrompt from "@/components/FirstPrompt";
import Frame from "react-frame-component";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { cn, updateProject, downloadHTML } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import Agnost from "@/lib/agnost";

const theme = githubGist;
const exampleText = "A login form";

export default function Generate(props: { reset: () => void }) {
  const { user, setUser } = useAuth();
  const { replace } = useRouter();
  const { set, get, has, deleteByKey } = useSearchParams();

  const [hasNoCreditsError, setHasNoCreditsError] = useState(false);
  const [firstPrompt, setFirstPrompt] = useState<null | string>(null);
  const [codeViewActive, setCodeViewActive] = useState(false);
  const [nanoId, setNanoId] = useState<string>();
  const [iframeContent, setIframeContent] = useState<string>();
  const [projectId, setProjectId] = useState<string>();
  const [subProjectId, setSubProjectId] = useState<string>();
  const [projects, setProjects] = useState<ProjectHistory[]>([]);
  const [copied, setCopied] = useState(false);
  const [finished, setFinished] = useState(false);
  const [rated, setRated] = useState(false);

  const selected = Number(get("selected") ?? 0);

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
      channelId: nanoId,
    },
    onResponse: (message) => {
      setHasNoCreditsError(false);
      decreaseCredit();
    },
    onFinish: async (message: Message) => {
      try {
        const res = JSON.parse(message.content) as { credits: number };
        setCredits(res.credits);
        setHasNoCreditsError(res.credits === 0);
      } catch {
        await saveResult(message.content);
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
      alert("Failed to copy URL to clipboard");
      setCopied(false);
    }
  }

  const projectIdCallback = ({ message }: any) => {
    setProjectId(message.id);
    sessionStorage.setItem("projectId", message.id);
    setProjects((prev) => {
      return [
        ...prev,
        {
          id: message.id,
          prompt: message.prompt,
          ready: false,
          isSubProject: false,
        },
      ];
    });
  };

  const subProjectIdCallback = ({
    message,
  }: {
    message: { id: string; prompt: string };
  }) => {
    setSubProjectId(message.id);
    sessionStorage.setItem("subProjectId", message.id);
    setProjects((prev) => {
      return [
        ...prev,
        {
          id: message.id,
          prompt: message.prompt,
          ready: false,
          isSubProject: true,
        },
      ];
    });
  };

  useEffect(() => {
    const { realtime } = Agnost.getBrowserClient();
    const roomId = uuidv4();
    setNanoId(roomId);
    realtime.join(roomId);
    sessionStorage.clear();

    realtime.on("projectId", projectIdCallback);
    realtime.on("subProjectId", subProjectIdCallback);
    return () => {
      realtime.off("projectId", projectIdCallback);
      realtime.off("subProjectId", subProjectIdCallback);
      realtime.leave(roomId);
    };
  }, []);

  useEffect(() => {
    const lastProject = projects[projects.length - 1];
    if (!lastProject || !lastProject?.ready) return;

    setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("selected", `${projects.length - 1}`);
      replace(`?${params.toString()}`);
    }, 1000);
  }, [projects]);

  const saveResult = async (result: string) => {
    const projectId = sessionStorage.getItem("projectId");
    const subProjectId = sessionStorage.getItem("subProjectId");

    const type = subProjectId ? "sub-project" : "project";
    const id = subProjectId ?? projectId;

    if (!id) return;

    await updateProject({ result }, id, type);

    if (projectId) setFinished(true);

    setProjects((prev) => {
      return prev.map((sb, index) => {
        if (sb.id === id) {
          return { ...sb, ready: true, result };
        }
        return sb;
      });
    });
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role !== "user")
      setIframeContent(lastMessage.content);
  }, [messages]);

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
          "text-ellipsis border border-gray-300 p-2 px-4 transition focus:border-gray-400 focus:shadow-lg focus:outline-0",
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
      {!firstPrompt && (
        <p
          className="ml-4 text-xs font-medium text-gray-500"
          onClick={() => setInput(exampleText)}
        >
          <strong>Tip:</strong> {exampleText}
        </p>
      )}
    </form>
  );

  function stopGeneration() {
    const id = subProjectId ?? projectId;
    stop();
    setProjects((prev) => {
      return prev.filter((p) => p.id !== id);
    });
  }

  const HeaderButtons = (
    <div className="lg:max-w-auto flex items-center gap-2">
      {isLoading && (
        <Button
          onClick={stopGeneration}
          className="h-[34px] gap-2 whitespace-nowrap px-3 py-1"
        >
          <LoadingSpinner className={cn("mr-1")} />
          Stop generation
        </Button>
      )}

      {finished && !rated && selected === 0 && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set("rateModal", "true");
                  replace(`?${params.toString()}`);
                }}
                className="aspect-square h-[34px] gap-2 whitespace-nowrap p-1"
              >
                <Star className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rate your experience</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Button
        className="h-[34px] gap-2 whitespace-nowrap px-3 py-1"
        onClick={() => {
          sessionStorage.clear();
          deleteByKey("selected");
          props.reset();
        }}
      >
        New
        <Plus className="h-5 w-5" />
      </Button>
      {projects.some((p) => p.ready) && (
        <Button
          className="h-[34px] gap-2 whitespace-nowrap px-3 py-1"
          onClick={share}
        >
          {copied ? (
            <>
              Copied
              <Check className="h-5 w-5" />
            </>
          ) : (
            <>
              Share
              <Share className="h-5 w-5" />
            </>
          )}
        </Button>
      )}
      <Button
        className="h-[34px] gap-2 whitespace-nowrap px-3 py-1"
        onClick={() => setCodeViewActive(!codeViewActive)}
      >
        {codeViewActive ? (
          <>
            Display
            <MonitorSmartphone className="h-5 w-5" />
          </>
        ) : (
          <>
            Code
            <Code2 className="h-5 w-5" />
          </>
        )}
      </Button>
      <Button className="aspect-square h-[34px] gap-2 p-1" onClick={handleSave}>
        <Download className="h-5 w-5" />
      </Button>
    </div>
  );

  const selectedComponent = useMemo(() => {
    return {
      url: selected === 0 ? "/api/preview/" : `/api/preview/sub/`,
      id: projects[selected]?.id,
      result: projects[selected]?.result,
    };
  }, [projects, selected]);

  return (
    <>
      <div
        className={cn(
          "flex min-h-[calc(100vh-72px)] w-full flex-col",
          "items-center overflow-hidden",
          "px-4 pt-6 md:px-14",
        )}
      >
        {isLoading || firstPrompt ? null : <Hero />}

        {!firstPrompt && (
          <div className="flex w-full flex-col items-center justify-center">
            {Form}
          </div>
        )}

        {hasNoCreditsError && <NoCredits />}

        {!hasNoCreditsError && iframeContent && (
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
                      : iframeContent}
                  </SyntaxHighlighter>
                  <Frame
                    sandbox="allow-same-origin allow-scripts"
                    mountTarget="body"
                    initialContent={`<!DOCTYPE html><html><head> <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet"> <script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/lib/index.min.js"></script> <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/tailwind.min.css" rel="stylesheet"> <script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2/dist/alpine.min.js" defer></script> <script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/lib/index.min.js"></script> <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> </head> <body></body> </html>`}
                    className={cn(
                      "h-full w-full",
                      !codeViewActive ? "block" : "hidden",
                    )}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: has("selected")
                          ? (selectedComponent.result as string)
                          : iframeContent,
                      }}
                    ></div>
                  </Frame>
                </BrowserWindow>
                {Form}
              </div>
              <History
                onClick={(index) => replace(`?selected=${index}`)}
                projects={projects}
              />
            </div>
          </section>
        )}

        {isLoading && !iframeContent && <LoadingSpinner />}
      </div>
      <RateModal key={projectId} onRateSubmit={() => setRated(true)} />
    </>
  );
}
