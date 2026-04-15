"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, LogOut, ChevronRight, type LucideIcon, Target, Leaf, Dumbbell, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

const PROFILE_ITEMS: {
  icon: LucideIcon;
  label: string;
  value: string;
}[] = [
  { icon: Target, label: "Health Goal", value: "Weight Loss" },
  { icon: Leaf, label: "Dietary Preference", value: "Non-Veg" },
  { icon: Dumbbell, label: "Target Macros", value: "High Protein, Low Carb" },
  { icon: UserCircle, label: "Body Profile", value: "Female, 28y, 70kg, 170cm" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background bio-luminous-bg text-foreground">
      <PageHeader title="Profile" />

      <motion.main
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-6 py-8 max-w-xl mx-auto space-y-8"
      >
        {/* User Info */}
        <motion.div variants={fadeUp} className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
            <div className="relative w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-muted-foreground border-4 border-background shadow-lg">
              <User className="w-9 h-9" />
            </div>
          </div>
          <h2 className="text-xl font-bold mt-4">Alex Johnson</h2>
          <p className="text-sm text-muted-foreground">alex@example.com</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Member since April 2026
          </p>
        </motion.div>

        {/* Profile Details */}
        <motion.div variants={fadeUp}>
          <GlassCard variant="default" padding="none" className="overflow-hidden divide-y divide-border/30">
            {PROFILE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="w-full p-4 flex items-center gap-3.5 hover:bg-surface-container/50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      {item.label}
                    </p>
                    <p className="font-semibold text-sm truncate">{item.value}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                </button>
              );
            })}
          </GlassCard>
        </motion.div>

        {/* Sign Out */}
        <motion.div variants={fadeUp}>
          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onClick={() => {
              toast("Signed out", { description: "You've been logged out." });
              router.push("/");
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </motion.div>
      </motion.main>
    </div>
  );
}
