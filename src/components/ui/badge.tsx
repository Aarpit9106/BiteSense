import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-semibold transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-surface-container text-foreground",
        success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
        danger: "bg-red-500/10 text-red-700 dark:text-red-400",
        info: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
        accent: "bg-accent/10 text-accent",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5 rounded uppercase tracking-widest",
        md: "text-xs px-3 py-1 rounded-full",
        lg: "text-sm px-4 py-1.5 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
