"use client";

import { cn, downloadHTML, nanoid, updateProject } from "@/utils/helpers";
import BrowserWindow from "@/components/BrowserWindow";
import LoadingSpinner from "@/components/loadingSpinner";
import Button from "@/components/Button";
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
import { Message, useChat } from "ai/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { realtime } from "@/utils/altogic";
import Hero from "@/components/Hero";
import NoCredits from "@/components/NoCredits";
import { ProjectHistory } from "@/types";
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
        `${window.location.origin}/projects/${projectId}?selected=${selected}`
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

  const subProjectIdCallback = ({ message }: any) => {
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
    const roomId = nanoid();
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
        !firstPrompt && "sm:w-11/12 md:w-[800px] mx-auto mb-4",
        firstPrompt && "w-full flex justify-center items-center"
      )}
    >
      <input
        className={cn(
          "p-2 focus:outline-0 focus:shadow-lg focus:border-gray-400 transition border text-ellipsis border-gray-300 px-4",
          firstPrompt
            ? "w-full bg-white/50 hover:border-black rounded-3xl"
            : "w-full mb-3 rounded-full"
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
          className="text-xs ml-4 font-medium text-gray-500"
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
    <div className="flex gap-2 items-center lg:max-w-auto">
      {isLoading && (
        <Button
          onClick={stopGeneration}
          className="py-1 px-3 h-[34px] whitespace-nowrap gap-2"
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
                className="p-1 gap-2 h-[34px] whitespace-nowrap aspect-square"
              >
                <Star className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rate your experience</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Button
        className="py-1 px-3 h-[34px] whitespace-nowrap gap-2"
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
          className="py-1 px-3 h-[34px] whitespace-nowrap gap-2"
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
        className="py-1 px-3 h-[34px] whitespace-nowrap gap-2"
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
      <Button className="p-1 gap-2 h-[34px] aspect-square" onClick={handleSave}>
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
          "flex flex-col w-full min-h-[calc(100vh-72px)]",
          "overflow-hidden items-center",
          "px-4 md:px-14 pt-6"
        )}
      >
        {isLoading || firstPrompt ? null : <Hero />}

        {hasNoCreditsError && <NoCredits />}

        {!hasNoCreditsError && iframeContent && (
          <section className="space-y-2 w-full">
            {firstPrompt && <FirstPrompt firstPrompt={firstPrompt} />}
            <div className="w-full gap-4 grid lg:grid-cols-[300px_1fr_300px] lg:h-[calc(100vh-160px)] items-center">
              <div className="hidden lg:block" />
              <div className="w-full h-[calc(100vh-160px)] grid grid-rows-[1fr_auto] space-y-2.5">
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
                      ? (selectedComponent.result as string)
                      : iframeContent}
                  </SyntaxHighlighter>
                  <Frame
                    sandbox="allow-same-origin allow-scripts"
                    mountTarget="body"
                    initialContent={`<!DOCTYPE html><html><head> <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet"> <script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/lib/index.min.js"></script> <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/tailwind.min.css" rel="stylesheet"> <script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2/dist/alpine.min.js" defer></script> <script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/lib/index.min.js"></script> <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> </head> <body></body> </html>`}
                    className={cn(
                      "w-full h-full",
                      !codeViewActive ? "block" : "hidden"
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
