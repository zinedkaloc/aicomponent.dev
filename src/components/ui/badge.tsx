import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center  border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        active: "bg-green-500 text-white border-transparent hover:bg-green-600",
      },
      size: {
        sm: "text-[10px] px-1.5 py-[1px]",
        default: "px-2.5 py-0.5 text-xs",
        md: "text-sm px-2.5 py-1",
        lg: "text-base px-3 py-1.5",
        xl: "text-lg px-4 py-2",
      },
      rounded: {
        default: "rounded-full",
        square: "rounded",
        sm: "rounded-sm",
        md: "rounded-md",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

type BadgeVariants = typeof badgeVariants;

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, size, rounded, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size, rounded }), className)}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, type BadgeVariants };
