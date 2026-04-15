"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Settings, History, Utensils, Heart, ScanLine } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { EmptyState } from "@/components/ui/empty-state";

const HISTORY_MOCK = [
  { id: 1, name: "Sweetgreen", date: "Today, 1:30 PM", score: 85, dishes: 6 },
  { id: 2, name: "Shake Shack", date: "Yesterday, 7:00 PM", score: 40, dishes: 4 },
  { id: 3, name: "Chipotle", date: "Apr 12, 12:45 PM", score: 72, dishes: 5 },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background bio-luminous-bg text-foreground pb-8">
      {/* Header */}
      <header className="sticky top-0 w-full z-40 bg-background/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between border-b border-border/30">
        <span className="text-xl font-bold tracking-tight text-foreground">
          BiteSense
        </span>
        <Link
          href="/profile"
          className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-surface-container transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      <motion.main
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-6 py-6 max-w-2xl mx-auto space-y-8"
      >
        {/* Welcome + Goal Card */}
        <motion.section variants={fadeUp}>
          <h1 className="text-2xl font-bold tracking-tight">Hello, Alex</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Ready to make smart choices today?
          </p>

          <GlassCard
            variant="elevated"
            padding="md"
            className="mt-5 relative overflow-hidden"
          >
            {/* Decorative orb */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between relative">
              <div>
                <Badge variant="success" size="sm">
                  Daily Goal
                </Badge>
                <p className="text-2xl font-bold mt-2">Weight Loss</p>
              </div>
              <ScoreRing score={72} size={60} strokeWidth={5}>
                <Heart className="w-5 h-5 text-emerald-600" />
              </ScoreRing>
            </div>

            <div className="flex gap-6 mt-5 pt-5 border-t border-border/30">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  Calories
                </p>
                <p className="font-bold text-lg tabular-nums">1,800</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  Protein
                </p>
                <p className="font-bold text-lg tabular-nums text-emerald-600">
                  120g
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  Scans
                </p>
                <p className="font-bold text-lg tabular-nums">
                  {HISTORY_MOCK.length}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={fadeUp} className="grid grid-cols-2 gap-3">
          <Link href="/scan">
            <GlassCard
              variant="interactive"
              padding="md"
              className="flex flex-col items-center text-center group border-emerald-500/20 bg-emerald-500/[0.04]"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Scan Menu</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Photo or Video
              </p>
            </GlassCard>
          </Link>

          <GlassCard
            variant="interactive"
            padding="md"
            className="flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-muted-foreground mb-3">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Cheat Meal</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Relaxed mode
            </p>
          </GlassCard>
        </motion.section>

        {/* History */}
        <motion.section variants={fadeUp}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" />
              Recent Scans
            </h2>
            <Button variant="ghost" size="sm" className="text-emerald-600">
              View All
            </Button>
          </div>

          {HISTORY_MOCK.length === 0 ? (
            <EmptyState
              icon={ScanLine}
              title="No scans yet"
              description="Scan a restaurant menu to see your personalized recommendations here."
              action={
                <Link href="/scan">
                  <Button>Scan Your First Menu</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-2.5">
              {HISTORY_MOCK.map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                >
                  <GlassCard
                    variant="interactive"
                    padding="sm"
                    className="flex items-center gap-4"
                  >
                    <ScoreRing score={scan.score} size={44} strokeWidth={3} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {scan.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {scan.date} · {scan.dishes} dishes
                      </p>
                    </div>
                    <Badge
                      variant={scan.score >= 70 ? "success" : "warning"}
                      size="sm"
                    >
                      {scan.score}
                    </Badge>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </motion.main>
    </div>
  );
}
