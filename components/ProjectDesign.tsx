"use client";

import { Project } from "@/types";
import BrowserWindow from "@/components/BrowserWindow";
import { useState } from "react";
import Button from "@/components/Button";
import { Code2, Download, MonitorSmartphone } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { github, dracula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Frame from "react-frame-component";
import { downloadHTML } from "@/utils/helpers";

interface ProjectDesignProps {
  project: Project;
}

export default function ProjectDesign(props: ProjectDesignProps) {
  const [codeViewActive, setCodeViewActive] = useState(false);
  return (
    <div className="w-full h-full">
      <BrowserWindow
        className="w-full h-full"
        contentClassName="max-w-full"
        header={
          <div className="flex gap-2 items-center">
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
        }
      >
        <Frame
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
              style={dracula}
              showLineNumbers
            >
              {props.project?.result}
            </SyntaxHighlighter>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: props.project?.result }} />
          )}
        </Frame>
      </BrowserWindow>
    </div>
  );
}
