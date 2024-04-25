interface HTMLPreviewProps {
  html: string;
}

export default function HTMLPreview({ html }: HTMLPreviewProps) {
  return (
    <iframe
      loading="lazy"
      className="min-h-screen w-full cursor-pointer"
      srcDoc={html}
    />
  );
}
