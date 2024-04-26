import Spinner from "@/components/Spinner";

export default function ProjectByIdLoading() {
  return (
    <div className="mx-auto flex h-full w-full max-w-screen-xl items-center justify-center p-6">
      <Spinner />
    </div>
  );
}
