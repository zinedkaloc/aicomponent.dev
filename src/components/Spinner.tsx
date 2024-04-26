import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
}
export default function Spinner({ className }: SpinnerProps) {
  return (
    <Loader2 className={cn("animate-spin dark:text-primary", className)} />
  );
}
