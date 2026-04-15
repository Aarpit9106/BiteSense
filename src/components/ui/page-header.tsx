"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  showBack = true,
  backHref,
  rightAction,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 w-full z-40",
        "bg-background/80 backdrop-blur-xl",
        "px-6 py-4 flex items-center justify-between",
        "border-b border-border/30",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="rounded-full p-1.5 -ml-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-container transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <span className="text-lg font-bold tracking-tight">{title}</span>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  );
}
