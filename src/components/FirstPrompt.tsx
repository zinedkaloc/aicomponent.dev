export default function FirstPrompt(props: { firstPrompt: string }) {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-[300px_1fr_300px]">
      <div className="hidden lg:block" />
      <div className="!disabled:text-black !disabled:bg-white auth-btn inline-flex w-fit items-center justify-center space-x-2 rounded-xl border border-black bg-black px-4 py-1.5 text-sm text-white transition-all focus:outline-none enabled:hover:bg-white enabled:hover:text-black">
        {props.firstPrompt}
      </div>
      <div className="hidden lg:block" />
    </div>
  );
}
