export default function FirstPrompt(props: { firstPrompt: string }) {
  return (
    <div className="w-full gap-4 grid lg:grid-cols-[200px_1fr_200px]">
      <div className="hidden lg:block" />
      <div className="inline-flex w-fit items-center justify-center space-x-2 focus:outline-none px-4 py-1.5 rounded-xl border border-black bg-black text-sm text-white transition-all enabled:hover:bg-white enabled:hover:text-black !disabled:text-black !disabled:bg-white auth-btn">
        {props.firstPrompt}
      </div>
      <div className="hidden lg:block" />
    </div>
  );
}
