"use client";

import { Project, ProjectHistory } from "@/types";
import BrowserWindow from "@/components/BrowserWindow";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
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
import { cn, downloadHTML, initialIframeContent } from "@/utils/helpers";
import History from "@/components/History";
import FirstPrompt from "@/components/FirstPrompt";
import { useRouter, useSearchParams } from "next/navigation";

interface ProjectDesignProps {
  project: Project;
  subProjects?: Project[] | null;
}

export default function ProjectDesign(props: ProjectDesignProps) {
  const { push } = useRouter();
  const [codeViewActive, setCodeViewActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();
  const selected = +(searchParams.get("selected") ?? 0);

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
    <div className="flex gap-2 items-center">
      <Button
        className="py-1 px-3 h-[34px] gap-2"
        onClick={() => {
          sessionStorage.clear();
          push("/");
        }}
      >
        New
        <Plus className="h-5 w-5" />
      </Button>
      <Button className="py-1 px-3 h-[34px] gap-2" onClick={share}>
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
      <Button
        onClick={() => setCodeViewActive(!codeViewActive)}
        className="py-1 px-3 h-[34px] gap-2"
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
        onClick={() => {
          const content =
            selected === 0
              ? props.project.result
              : props.subProjects?.[selected - 1].result;
          if (content) downloadHTML(content);
        }}
        className="p-1 gap-2 h-[34px] aspect-square"
      >
        <Download className="h-5 w-5" />
      </Button>
    </div>
  );

  const subHistory = props.subProjects?.map((subProject) => ({
    id: subProject._id,
    prompt: subProject.content,
    isSubProject: true,
    ready: true,
  })) as ProjectHistory[];

  const history: ProjectHistory[] = [
    {
      id: props.project._id,
      prompt: props.project.content,
      isSubProject: false,
      ready: true,
    },
    ...(Array.isArray(subHistory) ? subHistory : []),
  ];

  const selectedComponent: {
    id?: string;
    result?: string;
    url?: string;
  } = {
    url: selected === 0 ? "/api/preview/" : `/api/preview/sub/`,
    id:
      selected === 0
        ? props.project._id
        : props.subProjects?.[selected - 1]._id,
    result:
      selected === 0
        ? props.project.result
        : props.subProjects?.[selected - 1].result,
  };

  return (
    <div className="space-y-2 w-full">
      <FirstPrompt firstPrompt={props.project.content} />
      <div className="w-full gap-4 grid lg:grid-cols-[300px_1fr_300px] lg:h-[calc(100vh-160px)] items-center">
        <div className="hidden lg:block" />
        <div className="w-full h-[calc(100vh-160px)]">
          <BrowserWindow
            contentClassName="bg-white overflow-auto"
            className="h-[calc(100vh-160px)]"
            header={HeaderButtons}
          >
            {selectedComponent.result && (
              <SyntaxHighlighter
                language="htmlbars"
                style={githubGist}
                showLineNumbers
                wrapLines
                wrapLongLines
                className={cn(!codeViewActive && "!hidden")}
              >
                {selectedComponent.result}
              </SyntaxHighlighter>
            )}
            <iframe
              loading="lazy"
              className={cn("w-full h-full", codeViewActive && "hidden")}
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
