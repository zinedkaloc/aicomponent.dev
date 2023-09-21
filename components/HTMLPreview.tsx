interface HTMLPreviewProps {
  html: string;
}

export default function HTMLPreview({ html }: HTMLPreviewProps) {
  return (
    <iframe
      loading="lazy"
      className="w-full min-h-screen cursor-pointer"
      srcDoc={html}
    />
  );
}
