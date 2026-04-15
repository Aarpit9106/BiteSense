"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertTriangle, Info, Activity } from "lucide-react";
import { processMenuScanner, SynthesizedResponse } from "@/ai/recommendationEngine";
import type { OnboardingData } from "@/components/onboarding/OnboardingWizard";

// For the MVP, we use static mock onboarding data to simulate context.
// In production, this would be fetched from Supabase using user context.
const MOCK_PROFILE: OnboardingData = {
  goal: "weight loss",
  diet: "non veg",
  preferences: ["high protein", "low carb"],
  age: "28",
  gender: "female",
  weight: "70",
  height: "170",
  activityLevel: "moderate"
};

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<SynthesizedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate analyzing the image that was captured in the scan component
    const analyze = async () => {
      try {
        const data = await processMenuScanner("mock-image-data", MOCK_PROFILE);
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    analyze();
  }, []);

  if (loading || !results) {
    return (
      <div className="min-h-screen bg-background bio-luminous-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mb-6" />
        <h2 className="text-xl font-bold font-headline">Synthesizing Results...</h2>
        <p className="text-muted-foreground mt-2">BiteSense AI mapping to your bio-profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bio-luminous-bg text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 w-full z-40 bg-background/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="text-primary hover:opacity-80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-xl font-bold tracking-tighter text-primary">Recommendations</span>
        </div>
      </header>

      <main className="px-6 py-8 max-w-2xl mx-auto space-y-10">
        
        {/* BEST FOR YOU Section */}
        {results.best.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Best For You
            </h2>
            <div className="space-y-4">
              {results.best.map((item) => (
                <div key={item.dish.id} className="glass-card p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
                  {/* Decorative glowing orb */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
                  
                  <h3 className="text-xl font-bold font-headline">{item.dish.name}</h3>
                  <p className="text-sm text-foreground/80 mt-1">{item.dish.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-background/50 rounded-full text-xs font-semibold">{item.analysis.estimatedCalories} kcal</span>
                    <span className="px-3 py-1 bg-background/50 rounded-full text-xs font-semibold">{item.analysis.macros.protein}g Protein</span>
                    <span className="px-3 py-1 bg-background/50 rounded-full text-xs font-semibold">{item.analysis.macros.carbs}g Carbs</span>
                  </div>

                  <div className="mt-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-snug">{item.analysis.reasoning}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* HIGH PROTEIN Section */}
        {results.highProtein.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-orange-600 flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" /> High Protein Options
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.highProtein.map((item) => (
                <div key={item.dish.id} className="glass-card p-5 rounded-3xl border-border/50 hover:bg-white/60 dark:hover:bg-black/60 transition-colors">
                  <h3 className="font-semibold text-lg">{item.dish.name}</h3>
                  <div className="flex gap-4 mt-2 mb-3">
                    <div className="text-sm"><span className="text-muted-foreground">Cals:</span> {item.analysis.estimatedCalories}</div>
                    <div className="text-sm font-bold text-orange-600"><span className="text-muted-foreground font-normal">Pro:</span> {item.analysis.macros.protein}g</div>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.analysis.reasoning}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AVOID Section */}
        {results.avoid.length > 0 && (
          <section className="space-y-4 opacity-80">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Items To Avoid
            </h2>
            <div className="space-y-3">
              {results.avoid.map((item) => (
                <div key={item.dish.id} className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 flex gap-4 items-center">
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.dish.name}</h3>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1">{item.analysis.reasoning}</p>
                  </div>
                  <div className="text-xs font-bold text-muted-foreground">
                    ~{item.analysis.estimatedCalories} kcal
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="fixed bottom-0 w-full z-10 bg-gradient-to-t from-background via-background p-6 pt-16 flex justify-center">
        <button className="bg-primary text-white rounded-full px-10 py-4 font-semibold text-lg hover:brightness-110 active:scale-95 transition-all drop-shadow-xl"
                onClick={() => router.push('/dashboard')}>
          Save Scan to History
        </button>
      </div>
    </div>
  );
}
