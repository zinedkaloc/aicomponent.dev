import AppFooter from "@/components/AppFooter";
import SubmissionForm from "@/components/SubmissionForm";

export default function HomePage() {
  return (
    <main>
      <div className="container flex h-[--full-height] flex-col items-center gap-4 pt-48">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-1.5">
          <h2 className="text-4xl font-semibold tracking-tighter sm:text-5xl [@media(max-width:480px)]:text-[2rem]">
            Chat. Design. Develop.
          </h2>
          <p className="text-balance text-center">
            Engage in conversation, craft stunning designs, and watch as your
            code takes form—all in one place.
          </p>
        </div>
        <SubmissionForm />
      </div>
    </main>
  );
}
