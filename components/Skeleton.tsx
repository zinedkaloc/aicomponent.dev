import React from "react";
import { cn } from "@/utils/helpers";

export default function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-50", className)}
      {...props}
    />
  );
}
