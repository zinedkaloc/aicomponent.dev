import * as PopoverPrimitive from "@radix-ui/react-dropdown-menu";
import { Dispatch, ReactNode, SetStateAction } from "react";

export default function Popover({
  children,
  content,
  align = "center",
}: {
  children: ReactNode;
  content: ReactNode | string;
  align?: "center" | "start" | "end";
}) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content
        sideOffset={8}
        align={align}
        className="animate-slide-up-fade z-50 block items-center rounded-md border border-gray-200 bg-white drop-shadow-lg"
      >
        {content}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
}
Popover.Item = PopoverPrimitive.Item;
