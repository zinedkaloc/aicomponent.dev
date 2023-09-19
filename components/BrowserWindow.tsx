import { ReactNode, forwardRef } from "react";
import { cn } from "@/utils/helpers";

interface BrowserWindowProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  header?: ReactNode;
}

const BrowserWindow = forwardRef<HTMLDivElement, BrowserWindowProps>(
  ({ children, header, className, contentClassName }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center w-full overflow-hidden browser-window",
          className,
        )}
      >
        <div className="border flex-1 flex flex-col rounded-xl w-full overflow-hidden">
          <div className="bg-white flex items-center justify-between px-3 border-b h-[55px]">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            {header && <div>{header}</div>}
          </div>
          <div className={cn("flex-1 overflow-hidden", contentClassName)}>
            {children}
          </div>
        </div>
      </div>
    );
  },
);

export default BrowserWindow;
BrowserWindow.displayName = "BrowserWindow";
