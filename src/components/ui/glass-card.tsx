import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassCardVariants = cva(
  // Base: frosted glass effect
  "rounded-3xl transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "glass-card",
        elevated:
          "glass-card shadow-xl shadow-black/[0.04] dark:shadow-black/20",
        interactive:
          "glass-card cursor-pointer hover:shadow-lg hover:shadow-emerald-500/[0.06] hover:border-emerald-500/30 active:scale-[0.98]",
        selected:
          "glass-card border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20",
        flat:
          "bg-surface-container border border-border/30",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      className={cn(glassCardVariants({ variant, padding, className }))}
      ref={ref}
      {...props}
    />
  )
);
GlassCard.displayName = "GlassCard";

export { GlassCard, glassCardVariants };
