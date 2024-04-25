import LoadingSpinner from "@/components/loadingSpinner";

export default function ProjectByIdLoading() {
  return (
    <div className="mx-auto flex h-full w-full max-w-screen-xl items-center justify-center p-6">
      <LoadingSpinner />
    </div>
  );
}
