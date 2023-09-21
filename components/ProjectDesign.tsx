"use client";

import { Project, ProjectHistory } from "@/types";
import BrowserWindow from "@/components/BrowserWindow";
import { useState } from "react";
import Button from "@/components/Button";
import { Code2, Download, MonitorSmartphone, Plus } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { downloadHTML, initialIframeContent } from "@/utils/helpers";
import History from "@/components/History";
import FirstPrompt from "@/components/FirstPrompt";
import { useRouter } from "next/navigation";

interface ProjectDesignProps {
  project: Project;
  subProjects?: Project[] | null;
}

export default function ProjectDesign(props: ProjectDesignProps) {
  const { push } = useRouter();
  const [codeViewActive, setCodeViewActive] = useState(false);
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
        onClick={() => downloadHTML(props.project.result)}
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
    ...subHistory,
  ];

  return (
    <div className="space-y-2 w-full">
      <FirstPrompt firstPrompt={props.project.content} />
      <div className="w-full gap-4 grid lg:grid-cols-[200px_1fr_200px] lg:h-[calc(100vh-160px)] items-center">
        <div className="hidden lg:block" />
        <div className="w-full h-[calc(100vh-160px)]">
          <BrowserWindow
            contentClassName="bg-white overflow-auto"
            className="h-[calc(100vh-160px)]"
            header={HeaderButtons}
          >
            {codeViewActive ? (
              <SyntaxHighlighter
                language="htmlbars"
                style={githubGist}
                showLineNumbers
                wrapLines
                wrapLongLines
              >
                {props.project.result}
              </SyntaxHighlighter>
            ) : (
              <iframe
                loading="lazy"
                srcDoc={props.project.result}
                className="w-full h-full"
              />
            )}
          </BrowserWindow>
        </div>
        <History projects={history} />
      </div>
    </div>
  );
}
