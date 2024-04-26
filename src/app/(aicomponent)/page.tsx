import SubmissionForm from "@/components/SubmissionForm";
import AIIcon from "@/components/AIIcon";

export default function HomePage() {
  return (
    <div className="container flex h-[--full-height] flex-col items-center gap-6 p-10">
      <AIIcon className="size-40 shrink-0" />
      <SubmissionForm />
    </div>
  );
}
