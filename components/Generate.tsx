"use client";

import {
  cn,
  downloadHTML,
  initialIframeContent,
  nanoid,
  updateProject,
} from "@/utils/helpers";
import BrowserWindow from "@/components/BrowserWindow";
import LoadingSpinner from "@/components/loadingSpinner";
import Button from "@/components/Button";
import { Code2, Download, MonitorSmartphone, Plus } from "lucide-react";
import RateModal from "@/components/RateModal";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useSearchParams from "@/hooks/useSearchParams";
import { Message, useChat } from "ai/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { realtime } from "@/utils/altogic";
import { useThrottle } from "@uidotdev/usehooks";
import Hero from "@/components/Hero";
import NoCredits from "@/components/NoCredits";
import { ProjectHistory } from "@/types";
import History from "@/components/History";
import FirstPrompt from "@/components/FirstPrompt";
import Frame from "react-frame-component";

const theme = githubGist;
const exampleText = "A login form";

export default function Generate(props: { reset: () => void }) {
  const { user, setUser } = useAuth();
  const { set } = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasNoCreditsError, setHasNoCreditsError] = useState(false);
  const [firstPrompt, setFirstPrompt] = useState<null | string>(null);
  const [codeViewActive, setCodeViewActive] = useState(false);
  const [showedRatingModal, setShowedRatingModal] = useState(false);
  const [nanoId, setNanoId] = useState<string>();
  const [iframeContent, setIframeContent] = useState<string>();
  const [projectId, setProjectId] = useState<string>();
  const [subProjectId, setSubProjectId] = useState<string>();
  const [projects, setProjects] = useState<ProjectHistory[]>([]);
  const throttledContent = useThrottle(iframeContent, 500);

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
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
    sessionStorage.setItem("subProjectId", message.id);
  };

  useEffect(() => {
    const roomId = nanoid();
    setNanoId(roomId);
    realtime.join(roomId);

    realtime.on("projectId", projectIdCallback);
    realtime.on("subProjectId", subProjectIdCallback);
    return () => {
      realtime.off("projectId", projectIdCallback);
      realtime.off("subProjectId", subProjectIdCallback);
      realtime.leave(roomId);
    };
  }, []);

  const saveResult = async (result: string) => {
    const projectId = sessionStorage.getItem("projectId");
    const subProjectId = sessionStorage.getItem("subProjectId");

    const type = subProjectId ? "sub-project" : "project";
    const id = subProjectId ?? projectId;

    if (!id) {
      return alert("Your result could not be saved. Please try again.");
    }

    await updateProject({ result }, id, type);

    setProjects((prev) => {
      return prev.map((sb) => {
        if (sb.id === id) {
          return { ...sb, ready: true };
        }
        return sb;
      });
    });

    if (!showedRatingModal) {
      set("rateModal", "true");
      setShowedRatingModal(true);
    }
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role !== "user")
      setIframeContent(lastMessage.content);
  }, [messages]);

  /*
  useEffect(() => {
    if (!iframeRef.current?.contentDocument || !throttledContent) return;

    iframeRef.current.contentDocument.open();
    iframeRef.current.contentDocument.write(
      `${initialIframeContent} ${throttledContent}`,
    );
    iframeRef.current.contentDocument.close();
  }, [throttledContent, codeViewActive]);


   */
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
        if (!firstPrompt) setFirstPrompt(input);
      }}
      className={cn(
        "w-full",
        !firstPrompt && "sm:w-11/12 md:w-[800px] mx-auto mb-4",
        firstPrompt && "w-full flex justify-center items-center",
      )}
    >
      <input
        className={cn(
          "p-2 focus:outline-0 focus:shadow-lg focus:border-gray-400 transition border text-ellipsis border-gray-300 px-4",
          firstPrompt
            ? "w-full bg-white/50 hover:border-black rounded-3xl"
            : "w-full mb-3 rounded-full",
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

  const HeaderButtons = (
    <div className="flex gap-2 items-center">
      <LoadingSpinner className={cn("mr-1", !isLoading && "opacity-0")} />
      <Button
        className="py-1 px-3 h-[34px] gap-2"
        onClick={() => {
          sessionStorage.clear();
          props.reset();
        }}
      >
        New
        <Plus className="h-5 w-5" />
      </Button>
      <Button
        className="py-1 px-3 h-[34px] gap-2"
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

  return (
    <>
      <div
        className={cn(
          "flex flex-col w-full min-h-[calc(100vh-72px)]",
          "overflow-hidden items-center",
          "px-4 md:px-16 lg:px-24 pt-6",
        )}
      >
        {isLoading || firstPrompt ? null : <Hero />}

        {!firstPrompt && (
          <div className="flex flex-col w-full justify-center items-center">
            {Form}
          </div>
        )}

        {hasNoCreditsError && <NoCredits />}

        {!hasNoCreditsError && iframeContent && (
          <section className="space-y-2 w-full">
            {firstPrompt && <FirstPrompt firstPrompt={firstPrompt} />}
            <div className="w-full gap-4 grid lg:grid-cols-[200px_1fr_200px] lg:h-[calc(100vh-160px)] items-center">
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
                    {iframeContent}
                  </SyntaxHighlighter>
                  <Frame
                    sandbox="allow-same-origin allow-scripts"
                    initialContent={`<!DOCTYPE html><html><head>
              <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet"> 
            <script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/lib/index.min.js"></script>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/tailwind.min.css" rel="stylesheet">
            <script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2/dist/alpine.min.js" defer></script> 
            <script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/lib/index.min.js"></script> 
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            </head>
            <body>
            <div id="root"></div>
            </body>
                      </html>
                    `}
                    className={cn(
                      "w-full h-full",
                      !codeViewActive ? "block" : "hidden",
                    )}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: iframeContent,
                      }}
                    ></div>
                  </Frame>
                </BrowserWindow>
                {Form}
              </div>
              <History projects={projects} />
            </div>
          </section>
        )}

        {isLoading && !iframeContent && <LoadingSpinner />}
      </div>
      <RateModal key={projectId} show={!!projectId} />
    </>
  );
}
