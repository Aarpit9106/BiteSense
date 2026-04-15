import Link from "next/link";
import { ArrowRight, Utensils } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background bio-luminous-bg text-center relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 glass-card p-10 md:p-14 rounded-[3rem] border border-border/50 max-w-2xl w-full mx-auto drop-shadow-xl">
        <div className="mx-auto bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <Utensils className="w-10 h-10 text-emerald-500" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-4 font-headline">
          BiteSense
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-12">
          Scan. Choose. Eat Smart.
        </p>

        <Link
          href="/onboarding"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-emerald-600 to-emerald-400 text-white rounded-full px-10 py-5 font-semibold text-lg hover:brightness-110 active:scale-95 transition-all duration-300 shadow-lg shadow-emerald-500/25 group"
        >
          Get Started
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="absolute bottom-8 text-center text-sm text-muted-foreground z-10">
        AI-Powered Nutrition Assistant
      </div>
    </main>
  );
}
