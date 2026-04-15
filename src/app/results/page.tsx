"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Dumbbell,
  ChevronDown,
  ScanLine,
  ArrowRightLeft,
  Zap,
  Brain,
  HeartPulse,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { processMenuScanner, SynthesizedResponse } from "@/ai/recommendationEngine";
import type { OnboardingData } from "@/types/onboarding";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

/* ─── Macro Bar Chart ─── */
function MacroBarChart({ macros }: { macros: { protein: number; carbs: number; fat: number } }) {
  const total = macros.protein + macros.carbs + macros.fat || 1;
  const bars = [
    { label: "Protein", value: macros.protein, pct: (macros.protein / total) * 100, color: "bg-orange-500" },
    { label: "Carbs", value: macros.carbs, pct: (macros.carbs / total) * 100, color: "bg-sky-500" },
    { label: "Fat", value: macros.fat, pct: (macros.fat / total) * 100, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-2.5 mt-3">
      {bars.map((bar) => (
        <div key={bar.label} className="flex items-center gap-2.5">
          <span className="text-[10px] font-medium text-muted-foreground w-12 shrink-0">{bar.label}</span>
          <div className="flex-1 h-2 rounded-full bg-border/30 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${bar.pct}%` }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
              className={cn("h-full rounded-full", bar.color)}
            />
          </div>
          <span className="text-[10px] font-bold tabular-nums w-8 text-right">{bar.value}g</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Score Breakdown ─── */
function ScoreBreakdown({ analysis }: { analysis: RecommendationResult["analysis"] }) {
  const scores = [
    { label: "Nutrition", score: analysis.nutritionistScore * 10, icon: Zap, color: "text-emerald-600" },
    { label: "Fitness", score: analysis.fitnessScore * 10, icon: Dumbbell, color: "text-orange-600" },
    { label: "Longevity", score: analysis.longevityScore * 10, icon: Brain, color: "text-purple-600" },
    { label: "Medical", score: analysis.medicalScore * 10, icon: Shield, color: "text-sky-600" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mt-3">
      {scores.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-1">
          <ScoreRing score={s.score} size={36} strokeWidth={3}>
            <s.icon className={cn("w-3 h-3", s.color)} />
          </ScoreRing>
          <span className="text-[9px] font-medium text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Healthier Swap Card ─── */
function HealthierSwap({
  avoid,
  suggestion,
}: {
  avoid: RecommendationResult;
  suggestion: RecommendationResult;
}) {
  return (
    <div className="flex items-stretch gap-2 mt-2">
      <div className="flex-1 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
        <p className="text-xs font-semibold line-through opacity-60">{avoid.dish.name}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {avoid.analysis.estimatedCalories} kcal
        </p>
      </div>
      <div className="flex items-center">
        <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          {suggestion.dish.name}
        </p>
        <p className="text-[10px] text-emerald-600/70 mt-0.5">
          {suggestion.analysis.estimatedCalories} kcal
        </p>
      </div>
    </div>
  );
}

/* ─── Expandable Dish Card ─── */
function DishCard({
  item,
  accent = "emerald",
  showBreakdown = false,
}: {
  item: RecommendationResult;
  accent?: "emerald" | "orange" | "red";
  showBreakdown?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const colorMap = {
    emerald: "border-emerald-500/30 bg-emerald-500/[0.04]",
    orange: "border-orange-500/20 bg-orange-500/[0.03]",
    red: "border-red-200/50 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10",
  };
  const reasoningIcon = {
    emerald: "text-emerald-600",
    orange: "text-orange-600",
    red: "text-red-600",
  };

  return (
    <GlassCard padding="none" className={cn("overflow-hidden", colorMap[accent])}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base tracking-tight">{item.dish.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {item.dish.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <MacroPill label="" value={item.analysis.estimatedCalories} unit=" kcal" color="emerald" />
            <MacroPill label="P" value={item.analysis.macros.protein} unit="g" color="orange" />
            <MacroPill label="C" value={item.analysis.macros.carbs} unit="g" color="blue" />
            <MacroPill label="F" value={item.analysis.macros.fat} unit="g" color="purple" />
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 space-y-3">
          {/* Reasoning */}
          <div className="flex gap-2 items-start p-3 rounded-xl bg-surface-container/50 text-xs leading-relaxed">
            <HeartPulse className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", reasoningIcon[accent])} />
            <p className="text-muted-foreground">{item.analysis.reasoning}</p>
          </div>

          {/* Macro Distribution Chart */}
          <MacroBarChart macros={item.analysis.macros} />

          {/* Score Breakdown */}
          {showBreakdown && <ScoreBreakdown analysis={item.analysis} />}
        </div>
      </motion.div>
    </GlassCard>
  );
}

/* ─── Main Results Page ─── */
export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<SynthesizedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const analyze = async () => {
      try {
        // Get the scanned image from sessionStorage
        const imageData = sessionStorage.getItem("bitesense_scan_image") || "mock-image-data";

        const data = await processMenuScanner(imageData, MOCK_PROFILE);
        setResults(data);

        // Clear stored image
        sessionStorage.removeItem("bitesense_scan_image");

        const modeLabel = data.meta.mode === "live" ? "AI Analysis" : "Demo Mode";
        toast.success(`${modeLabel} complete`, {
          description: `${data.meta.totalDishes} dishes analyzed`,
        });
      } catch (e) {
        console.error(e);
        setError(true);
        toast.error("Analysis failed", { description: "Please try scanning again." });
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

  // Score calculation
  const allGood = [...results.best, ...results.healthy, ...results.highProtein];
  const avgScore =
    allGood.length > 0
      ? Math.round(
          allGood.reduce(
            (acc, i) =>
              acc +
              (i.analysis.nutritionistScore +
                i.analysis.fitnessScore +
                i.analysis.longevityScore) *
                3.33,
            0
          ) / allGood.length
        )
      : 0;

  // Find a suggestion for swap (best item if available)
  const bestSwap = results.best[0] || results.healthy[0];

  return (
    <div className="min-h-screen bg-background bio-luminous-bg text-foreground pb-28">
      <PageHeader
        title="Recommendations"
        backHref="/dashboard"
        rightAction={
          <Badge variant={results.meta.mode === "live" ? "success" : "warning"} size="sm">
            {results.meta.mode === "live" ? "AI" : "Demo"}
          </Badge>
        }
      />

      <motion.main
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-6 py-6 max-w-2xl mx-auto space-y-8"
      >
        {/* ─── Hero Summary ─── */}
        <motion.div variants={fadeUp}>
          <GlassCard variant="elevated" padding="md" className="relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/8 blur-3xl rounded-full pointer-events-none" />
            <div className="flex items-center gap-5 relative">
              <ScoreRing score={Math.min(avgScore, 100)} size={72} strokeWidth={5}>
                <span className="text-lg font-bold">{Math.min(avgScore, 100)}</span>
              </ScoreRing>
              <div>
                <p className="font-bold text-lg">Menu Health Score</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {results.meta.totalDishes} dishes analyzed · {results.best.length} recommended
                </p>
                {results.meta.mode === "live" && results.meta.model && (
                  <p className="text-[10px] text-muted-foreground/50 mt-1">
                    Powered by {results.meta.model}
                  </p>
                )}
              </div>
            </div>

            {/* Quick macro summary of best item */}
            {results.best[0] && (
              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
                  Top Pick Macros
                </p>
                <MacroBarChart macros={results.best[0].analysis.macros} />
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* ─── Best For You ─── */}
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
                <DishCard key={item.dish.id} item={item} accent="emerald" showBreakdown />
              ))}
            </div>
          </motion.section>
        )}

        {/* ─── High Protein ─── */}
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

        {/* ─── Avoid + Healthier Swaps ─── */}
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
                <div key={item.dish.id}>
                  <DishCard item={item} accent="red" />
                  {bestSwap && (
                    <div className="mt-1.5 px-1">
                      <HealthierSwap avoid={item} suggestion={bestSwap} />
                    </div>
                  )}
                </div>
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
