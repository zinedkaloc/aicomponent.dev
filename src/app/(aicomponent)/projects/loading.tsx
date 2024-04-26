import Spinner from "@/components/Spinner";

export default function ProjectsLoading() {
  return (
    <div className="w-ful l mx-auto flex h-full max-w-screen-xl items-center justify-center p-6">
      <Spinner />
    </div>
  );
}
