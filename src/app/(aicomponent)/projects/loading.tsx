import LoadingSpinner from "@/components/loadingSpinner";

export default function ProjectsLoading() {
  return (
    <div className="w-ful l mx-auto flex h-full max-w-screen-xl items-center justify-center p-6">
      <LoadingSpinner />
    </div>
  );
}
