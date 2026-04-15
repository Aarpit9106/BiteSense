"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Dumbbell,
  ChevronDown,
  ScanLine,
} from "lucide-react";
import { toast } from "sonner";
import { processMenuScanner, SynthesizedResponse } from "@/ai/recommendationEngine";
import type { OnboardingData } from "@/types/onboarding";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { MacroPill } from "@/components/ui/macro-pill";
import { ScoreRing } from "@/components/ui/score-ring";
import { SkeletonResults } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { RecommendationResult } from "@/ai/recommendationEngine";

const MOCK_PROFILE: OnboardingData = {
  goal: "weight loss",
  diet: "non veg",
  preferences: ["high protein", "low carb"],
  age: "28",
  gender: "female",
  weight: "70",
  height: "170",
  activityLevel: "moderate",
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

// Expandable dish card
function DishCard({
  item,
  accent = "emerald",
}: {
  item: RecommendationResult;
  accent?: "emerald" | "orange" | "red";
}) {
  const [expanded, setExpanded] = useState(false);
  const colorMap = {
    emerald: "border-emerald-500/30 bg-emerald-500/[0.04]",
    orange: "border-orange-500/20 bg-orange-500/[0.03]",
    red: "border-red-200/50 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10",
  };
  const reasoningBg = {
    emerald: "bg-emerald-500/8 border-emerald-500/15 text-emerald-800 dark:text-emerald-300",
    orange: "bg-orange-500/8 border-orange-500/15 text-orange-800 dark:text-orange-300",
    red: "bg-red-500/8 border-red-500/15 text-red-800 dark:text-red-300",
  };

  return (
    <GlassCard
      padding="none"
      className={cn("overflow-hidden", colorMap[accent])}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base tracking-tight">
            {item.dish.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {item.dish.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <MacroPill
              label=""
              value={item.analysis.estimatedCalories}
              unit=" kcal"
              color="emerald"
            />
            <MacroPill
              label="P"
              value={item.analysis.macros.protein}
              unit="g"
              color="orange"
            />
            <MacroPill
              label="C"
              value={item.analysis.macros.carbs}
              unit="g"
              color="blue"
            />
            <MacroPill
              label="F"
              value={item.analysis.macros.fat}
              unit="g"
              color="purple"
            />
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>

      {/* Expandable reasoning */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div
          className={cn(
            "mx-5 mb-5 p-3.5 rounded-xl border text-xs leading-relaxed",
            reasoningBg[accent]
          )}
        >
          <div className="flex gap-2 items-start">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-60" />
            <p>{item.analysis.reasoning}</p>
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<SynthesizedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const analyze = async () => {
      try {
        const data = await processMenuScanner("mock-image-data", MOCK_PROFILE);
        setResults(data);
        toast.success("Analysis complete", {
          description: `Found ${data.best.length + data.highProtein.length + data.avoid.length + data.healthy.length} menu items`,
        });
      } catch (e) {
        console.error(e);
        setError(true);
        toast.error("Analysis failed", {
          description: "Please try scanning again.",
        });
      } finally {
        setLoading(false);
      }
    };
    analyze();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background bio-luminous-bg">
        <PageHeader title="Analyzing..." backHref="/dashboard" />
        <SkeletonResults />
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-background bio-luminous-bg flex flex-col">
        <PageHeader title="Results" backHref="/dashboard" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-xs">
            We couldn&apos;t analyze the menu. Try scanning again.
          </p>
          <Button className="mt-6" onClick={() => router.push("/scan")}>
            Retry Scan
          </Button>
        </div>
      </div>
    );
  }

  const totalDishes =
    results.best.length +
    results.highProtein.length +
    results.avoid.length +
    results.healthy.length;

  // Calculate average health score from best + healthy items
  const goodItems = [...results.best, ...results.healthy, ...results.highProtein];
  const avgScore =
    goodItems.length > 0
      ? Math.round(
          goodItems.reduce(
            (acc, i) =>
              acc +
              (i.analysis.nutritionistScore +
                i.analysis.fitnessScore +
                i.analysis.longevityScore) *
                3.33,
            0
          ) / goodItems.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-background bio-luminous-bg text-foreground pb-28">
      <PageHeader title="Recommendations" backHref="/dashboard" />

      <motion.main
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-6 py-6 max-w-2xl mx-auto space-y-8"
      >
        {/* Summary Bar */}
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <ScoreRing score={Math.min(avgScore, 100)} size={56} strokeWidth={4} />
          <div>
            <p className="font-bold text-base">Menu Health Score</p>
            <p className="text-xs text-muted-foreground">
              {totalDishes} dishes analyzed · {results.best.length} recommended
            </p>
          </div>
        </motion.div>

        {/* BEST FOR YOU */}
        {results.best.length > 0 && (
          <motion.section variants={fadeUp} className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Best For You
              </h2>
            </div>
            <div className="space-y-2.5">
              {results.best.map((item) => (
                <DishCard key={item.dish.id} item={item} accent="emerald" />
              ))}
            </div>
          </motion.section>
        )}

        {/* HIGH PROTEIN */}
        {results.highProtein.length > 0 && (
          <motion.section variants={fadeUp} className="space-y-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-orange-500" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-orange-600">
                High Protein
              </h2>
            </div>
            <div className="space-y-2.5">
              {results.highProtein.map((item) => (
                <DishCard key={item.dish.id} item={item} accent="orange" />
              ))}
            </div>
          </motion.section>
        )}

        {/* AVOID */}
        {results.avoid.length > 0 && (
          <motion.section variants={fadeUp} className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-red-600">
                Items To Avoid
              </h2>
            </div>
            <div className="space-y-2.5">
              {results.avoid.map((item) => (
                <DishCard key={item.dish.id} item={item} accent="red" />
              ))}
            </div>
          </motion.section>
        )}
      </motion.main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 z-10 p-5 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-2xl mx-auto">
          <Button
            size="xl"
            className="w-full"
            onClick={() => {
              toast.success("Scan saved to history!");
              router.push("/dashboard");
            }}
          >
            <ScanLine className="w-5 h-5" />
            Save Scan to History
          </Button>
        </div>
      </div>
    </div>
  );
}
