"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ScanLine, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: ScanLine, label: "AI-Powered" },
  { icon: Sparkles, label: "Personalized" },
  { icon: Shield, label: "Privacy-First" },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background bio-luminous-bg text-center relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="relative z-10 max-w-lg w-full mx-auto"
      >
        {/* Logo Mark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-8 shadow-lg shadow-emerald-600/20"
        >
          <span className="text-white font-bold text-2xl tracking-tighter">B</span>
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter text-foreground">
          BiteSense
        </h1>
        <p className="text-lg text-muted-foreground font-medium mt-3">
          Scan. Choose. Eat Smart.
        </p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center gap-2 mt-6"
        >
          {features.map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-xs font-medium text-muted-foreground"
            >
              <f.icon className="w-3 h-3" />
              {f.label}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-10 space-y-3"
        >
          <Link href="/onboarding">
            <Button size="xl" className="group">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <div>
            <Link href="/login">
              <Button variant="ghost" size="md">
                Already have an account? Sign in
              </Button>
            </Link>
          </div>
        </motion.div>

        <p className="text-xs text-muted-foreground/50 mt-6">
          Magic link sign-in · No password needed
        </p>
      </motion.div>
    </main>
  );
}
