"use client";

import { cn, downloadHTML, updateProject } from "@/utils/helpers";
import Socials from "@/components/Socials";
import Image from "next/image";
import BrowserWindow from "@/components/BrowserWindow";
import LoadingSpinner from "@/components/loadingSpinner";
import Button from "@/components/Button";
import { Code2, Download, MonitorSmartphone, Plus } from "lucide-react";
import Frame from "react-frame-component";
import RateModal from "@/components/RateModal";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useSearchParams from "@/hooks/useSearchParams";
import { useChat } from "ai/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const theme = githubGist;

const exampleText = "A login form with social provider options";

export default function Generate(props: { reset: () => void }) {
  const { user, setUser } = useAuth();
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [hasNoCreditsError, setHasNoCreditsError] = useState(false);
  const { set } = useSearchParams();
  const [firstPrompt, setFirstPrompt] = useState<null | string>(null);
  const [iframeContent, setIframeContent] = useState("");
  const iframeRef = useRef(null);
  const [codeViewActive, setCodeViewActive] = useState(false);
  const [showedRatingModal, setShowedRatingModal] = useState(false);

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
  } = useChat({
    onResponse: (message) => {
      setHasNoCreditsError(false);
      setLastMessageId(null);
      decreaseCredit();
    },
    onFinish: async (message) => {
      try {
        const res = JSON.parse(message.content) as { credits: number };
        setCredits(res.credits);
        setHasNoCreditsError(res.credits === 0);
      } catch {
        await saveResult(message.content);
      }
    },
  });

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role !== "user") {
      setIframeContent(lastMessage.content);
    }
  }, [messages]);

  const handleSave = () => {
    downloadHTML(iframeContent);
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

  async function saveResult(result: string) {
    const { _id } = await updateProject({
      result,
    });
    setLastMessageId(_id);

    if (!showedRatingModal) {
      set("rateModal", "true");
      setShowedRatingModal(true);
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
            ? "w-[500px] bg-white/50 hover:border-black rounded-3xl"
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

  return (
    <>
      <div
        className={cn(
          "flex flex-col w-full min-h-[calc(100vh-72px)] mx-auto",
          "overflow-hidden items-center",
          "px-4 md:px-16 lg:px-24 pt-6",
        )}
      >
        <Socials />
        {isLoading || firstPrompt ? null : (
          <div className="relative py-6 flex flex-col justify-center">
            <Image
              src="/logoa.png"
              alt="AIPage.dev logo"
              width={200}
              height={200}
              className="mx-auto h-32 w-32"
            />
            <div className="text-center sm:w-11/12 md:w-[800px]">
              <h1 className="text-5xl font-bold text-ellipsis tracking-tight">
                Create components easily{" "}
                <span className="font-normal">with ai</span>
              </h1>
              <p className="text-lg text-gray-700 mt-4 tracking-tight">
                Experience the future of web design. With ai, creating a landing
                page is not only easy but also efficient, precise, and tailored
                to your needs.
              </p>
            </div>
          </div>
        )}

        {
          <div className="flex flex-col w-full justify-center items-center">
            {!firstPrompt && Form}
          </div>
        }

        {hasNoCreditsError && (
          <div className="flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 100 100"
            >
              <polygon points="50,15 85,85 15,85" fill="#FF6B6B" />
              <text
                x="50"
                y="75"
                fontSize="40"
                fontWeight="bold"
                textAnchor="middle"
                fill="#FFFFFF"
              >
                !
              </text>
            </svg>
            <h1 className="text-3xl text-gray-800 mb-2">No Credits</h1>
            <p className="text-gray-600 mb-6">
              You do not have enough credits to proceed with this request today.
              Please try again tomorrow.
            </p>
          </div>
        )}

        {!hasNoCreditsError && iframeContent && (
          <div className="w-full flex justify-center items-center mb-4 scroll-pt-2 scroll-mt-2">
            <div className="w-[min(100%-2rem,1100px)] h-[calc(100vh-144px)] grid grid-rows-[auto_1fr_auto] space-y-2.5">
              <div className="inline-flex w-fit items-center justify-center space-x-2 focus:outline-none px-4 py-1.5 rounded-xl border border-black bg-black text-sm text-white transition-all enabled:hover:bg-white enabled:hover:text-black !disabled:text-black !disabled:bg-white auth-btn">
                {firstPrompt}
              </div>
              <BrowserWindow
                contentClassName="bg-white"
                header={
                  <div className="flex gap-2 items-center">
                    <LoadingSpinner
                      className={cn("mr-1", !isLoading && "opacity-0")}
                    />
                    <Button
                      className="py-1 px-3 h-[34px] gap-2"
                      onClick={() => props.reset()}
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
                    <Button
                      className="p-1 gap-2 h-[34px] aspect-square"
                      onClick={handleSave}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                }
              >
                <Frame
                  ref={iframeRef}
                  sandbox="allow-same-origin allow-scripts"
                  className="w-full h-full"
                  initialContent={`<!DOCTYPE html>
                      <html>
                        <head>
                          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/tailwind.min.css">
                          <script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2/dist/alpine.min.js" defer></script>
                          <script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/lib/index.min.js"></script>
                          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
                          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                        </head>
                        <body>
                          <div id="root"></div>
                       </body>
                      </html>`}
                >
                  {codeViewActive ? (
                    <SyntaxHighlighter
                      language="htmlbars"
                      className="p-2"
                      style={theme}
                      showLineNumbers
                    >
                      {iframeContent}
                    </SyntaxHighlighter>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: iframeContent }} />
                  )}
                </Frame>
              </BrowserWindow>
              {Form}
            </div>
          </div>
        )}

        {isLoading && !iframeContent && <LoadingSpinner />}
      </div>
      <RateModal key={lastMessageId} show={!!lastMessageId} />
    </>
  );
}
