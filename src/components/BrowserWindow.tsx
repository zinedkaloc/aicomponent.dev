import { ReactNode, forwardRef, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface BrowserWindowProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  header?: ReactNode;
  style?: CSSProperties;
}

const BrowserWindow = forwardRef<HTMLDivElement, BrowserWindowProps>(
  ({ children, header, className, style, contentClassName }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={cn(
          "browser-window flex w-full shrink-0 flex-col items-center overflow-hidden",
          className,
        )}
      >
        <div className="flex w-full flex-1 flex-col overflow-hidden rounded-xl border">
          <div className="flex h-[55px] items-center justify-between gap-4 border-b bg-white px-3">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            {header && (
              <div className="overflow-auto scrollbar-hide">{header}</div>
            )}
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
