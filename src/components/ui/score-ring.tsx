"use client";

import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number; // 0-100
  size?: number; // px
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export function ScoreRing({
  score,
  size = 64,
  strokeWidth = 4,
  className,
  children,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 70) return "stroke-emerald-500";
    if (s >= 40) return "stroke-amber-500";
    return "stroke-red-500";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-label={`Health score: ${score}`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-border/40"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn(getColor(score), "transition-all duration-700 ease-out")}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? (
          <span className="text-sm font-bold">{score}</span>
        )}
      </div>
    </div>
  );
}
