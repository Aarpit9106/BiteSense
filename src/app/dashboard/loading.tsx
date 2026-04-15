import { SkeletonDashboard } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background bio-luminous-bg">
      <header className="sticky top-0 w-full z-40 bg-background/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between border-b border-border/30">
        <div className="skeleton h-6 w-24 rounded" />
        <div className="skeleton h-8 w-8 rounded-full" />
      </header>
      <SkeletonDashboard />
    </div>
  );
}
