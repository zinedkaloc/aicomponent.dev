import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex items-center justify-center gap-2 px-4 py-1.5 text-sm transition-all focus:outline-none rounded-md",
  {
    variants: {
      variant: {
        ghost: "hover:bg-accent hover:text-accent-foreground",
        default:
          "border border-black bg-black text-white active:bg-white active:text-black enabled:hover:bg-white enabled:hover:text-black disabled:cursor-not-allowed disabled:opacity-50",
        destructive:
          "flex items-center justify-center gap-2 border border-red-500 bg-red-500 px-4 text-sm text-white enabled:hover:bg-white enabled:hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50",
        light:
          "border border-gray-200 bg-white text-gray-500 active:border-black active:text-black enabled:hover:border-black enabled:hover:text-black disabled:cursor-not-allowed disabled:opacity-50",
        pill: "!disabled:text-black !disabled:bg-white rounded-full border border-black bg-black text-sm text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 px-2 [&>svg]:size-4",
        sm: "h-9 px-3 [&>svg]:size-4",
        lg: "h-11 px-8 [&>svg]:size-5",
        icon: "h-10 w-10 p-0 [&>svg]:size-4 aspect-square",
        "icon-sm": "h-8 w-8 p-0 aspect-square [&>svg]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
