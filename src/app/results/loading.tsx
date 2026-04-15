import { SkeletonResults } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";

export default function ResultsLoading() {
  return (
    <div className="min-h-screen bg-background bio-luminous-bg">
      <PageHeader title="Analyzing..." backHref="/dashboard" />
      <SkeletonResults />
    </div>
  );
}
