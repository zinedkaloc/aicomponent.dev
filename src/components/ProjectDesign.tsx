"use client";

import { Project, ProjectHistory, User } from "@/types";
import BrowserWindow from "@/components/BrowserWindow";
import { CSSProperties, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Code2,
  Download,
  MonitorSmartphone,
  Plus,
  Share,
} from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { cn, downloadHTML } from "@/lib/utils";
import History from "@/components/History";
import FirstPrompt from "@/components/FirstPrompt";
import { useRouter, useSearchParams } from "next/navigation";
import { useWindowSize } from "@uidotdev/usehooks";

interface ProjectDesignProps {
  project: Project;
  subProjects?: Project[];
}

export default function ProjectDesign(props: ProjectDesignProps) {
  const { push } = useRouter();
  const [codeViewActive, setCodeViewActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();
  const selected = +(searchParams.get("selected") ?? 0);

  const browserWindow = useRef<HTMLDivElement>(null);
  useWindowSize();

  async function share() {
    const url = new URL(window.location.href);
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy URL to clipboard");
      setCopied(false);
    }
  }

  const HeaderButtons = (
    <div className="flex items-center gap-2">
      <Button
        variant="light"
        size="xs"
        className="gap-2 px-3 py-1"
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
      <Button
        variant="light"
        size="xs"
        onClick={() => setCodeViewActive(!codeViewActive)}
        className="gap-2 px-3 py-1"
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
        variant="light"
        size="xs"
        onClick={() => {
          const content =
            selected === 0
              ? props.project.result
              : props.subProjects?.[selected - 1]?.result;
          if (content) downloadHTML(content);
        }}
        className="aspect-square gap-2 p-1"
      >
        <Download />
      </Button>
    </div>
  );

  const subHistory = props.subProjects?.map((subProject) => ({
    id: subProject.id,
    prompt: subProject?.prompt,
    isSubProject: true,
    ready: true,
  })) as ProjectHistory[];

  const history: ProjectHistory[] = [
    {
      id: props.project.id,
      prompt: props.project.prompt,
      isSubProject: false,
      ready: true,
    },
    ...(Array.isArray(subHistory) ? subHistory : []),
  ];

  const selectedComponent: {
    id?: number;
    result?: string;
    url?: string;
  } = {
    url: "/api/preview/",
    id:
      selected === 0 ? props.project.id : props.subProjects?.[selected - 1]?.id,
    result:
      selected === 0
        ? props.project.result
        : props.subProjects?.[selected - 1]?.result,
  };

  const user =
    typeof props.project.created_by === "number"
      ? undefined
      : props.project.created_by;

  return (
    <div className="w-full space-y-2 py-4">
      <FirstPrompt user={user} firstPrompt={props.project.prompt} />
      <div className="grid w-full max-w-full gap-4 md:grid-cols-[300px_1fr_300px] lg:max-h-[calc(var(--full-height)-5rem)]">
        <div className="hidden md:block" />
        <div className="h-full">
          <BrowserWindow
            ref={browserWindow}
            contentClassName="bg-white overflow-auto max-w-full"
            className="h-full max-w-full lg:max-h-[calc(var(--full-height)-5rem)]"
            header={HeaderButtons}
            style={
              {
                "--w":
                  browserWindow.current?.getBoundingClientRect().width! - 2,
              } as CSSProperties
            }
          >
            {selectedComponent.result && (
              <SyntaxHighlighter
                language="htmlbars"
                style={githubGist}
                showLineNumbers
                wrapLines
                wrapLongLines
                className={cn(
                  "max-w-[calc(var(--w)*1px)]",
                  !codeViewActive && "!hidden",
                )}
              >
                {selectedComponent.result}
              </SyntaxHighlighter>
            )}
            <iframe
              loading="lazy"
              className={cn("h-full w-full", codeViewActive && "hidden")}
              src={`${selectedComponent.url}/${selectedComponent.id}`}
            />
          </BrowserWindow>
        </div>
        <History
          onClick={(index) => push(`?selected=${index}`)}
          projects={history}
        />
      </div>
    </div>
  );
}
