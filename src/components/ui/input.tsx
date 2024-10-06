import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  lol?: string;
}

interface LabelWrapperProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}

export function LabelWrapper({
  label,
  children,
  className,
  error,
}: LabelWrapperProps) {
  return (
    <div className="flex flex-col">
      <Label className={cn("font-semibold mt-2 mb-2", className)}>
        {label}
      </Label>
      {children}
      {error && <span className="text-sm text-red-500 mt-1.5">{error}</span>}
    </div>
  );
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
