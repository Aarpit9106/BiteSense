import { cn } from "@/lib/utils";

interface MacroPillProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: "emerald" | "orange" | "blue" | "purple" | "neutral";
  className?: string;
}

const colorMap = {
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  orange: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  blue: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  purple: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  neutral: "bg-surface-container text-muted-foreground",
};

export function MacroPill({
  label,
  value,
  unit = "",
  color = "neutral",
  className,
}: MacroPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
        colorMap[color],
        className
      )}
    >
      <span className="opacity-70">{label}</span>
      <span>
        {value}
        {unit}
      </span>
    </span>
  );
}
