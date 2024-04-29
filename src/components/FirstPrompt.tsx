"use client";
import UserAvatar from "@/components/UserAvatar";

export default function FirstPrompt(props: { firstPrompt: string }) {
  return (
    <div className="grid w-full gap-4 md:grid-cols-[300px_1fr_300px]">
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <UserAvatar />
        <div className="!disabled:text-black !disabled:bg-white auth-btn relative inline-flex w-fit items-center justify-center space-x-2 rounded-2xl border border-black bg-black px-3 py-1 text-sm text-white transition-all focus:outline-none enabled:hover:bg-white enabled:hover:text-black">
          {props.firstPrompt}
          <svg
            className="absolute bottom-[0.5px] left-[-5.5px]"
            fill="none"
            height="14"
            width="13"
          >
            <path
              className="fill-black"
              d="M6 .246c-.175 5.992-1.539 8.89-5.5 13.5 6.117.073 9.128-.306 12.5-3L6 .246Z"
            />
          </svg>
        </div>
      </div>
      <div className="hidden md:block" />
    </div>
  );
}
