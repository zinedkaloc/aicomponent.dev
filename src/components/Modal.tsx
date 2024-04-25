import { XIcon } from "lucide-react";
import { MouseEvent, ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  close: () => void;
  isOpen: boolean;
  className?: string;
  children: ReactNode;
  parentClassName?: string;
}
export default function Modal({
  close,
  children,
  isOpen,
  className,
  parentClassName,
}: ModalProps) {
  const modalWrapper = useRef<HTMLDivElement>(null);
  function modalWrapperClickHandler(event: MouseEvent) {
    if (!modalWrapper.current || event.target !== modalWrapper.current) return;
    close();
  }

  if (!isOpen) return null;
  return (
    <div
      ref={modalWrapper}
      className={cn(
        "modal fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm",
        parentClassName,
      )}
      onClick={modalWrapperClickHandler}
    >
      <div
        className={cn(
          "relative max-h-full w-full overflow-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:w-[400px]",
          className,
        )}
      >
        <button
          type="button"
          className="absolute right-4 top-4 text-gray-500 transition-colors hover:text-black focus:outline-none"
          onClick={close}
        >
          <XIcon />
        </button>
        {children}
      </div>
    </div>
  );
}
