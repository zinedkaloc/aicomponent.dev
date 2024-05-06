import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";

interface ErrorAlertProps {
  className?: string;
  children?: ReactNode;
  alertTitle?: string;
}

export default function ErrorAlert(props: ErrorAlertProps) {
  return (
    <Alert className={cn(props.className)} variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{props.alertTitle ?? "Error"}</AlertTitle>
      <AlertDescription className="text-balance">
        {props.children ??
          "Oops! Something went wrong. Please try again later."}
      </AlertDescription>
    </Alert>
  );
}
