import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-muted-foreground"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-xl bg-background/60 px-4 py-2",
            "border border-border/50 text-foreground",
            "placeholder:text-muted-foreground/50",
            "outline-none transition-all duration-200",
            "focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {hint && (
          <p className="text-xs text-muted-foreground/70">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
