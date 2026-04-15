"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Step1Goal from "./Step1Goal";
import Step2Diet from "./Step2Diet";
import Step3Preferences from "./Step3Preferences";
import Step4BodyInfo from "./Step4BodyInfo";
import Step5Finish from "./Step5Finish";

// Re-export from canonical location for backward compatibility
export type { OnboardingData } from "@/types/onboarding";
import type { OnboardingData } from "@/types/onboarding";

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    goal: "",
    diet: "",
    preferences: [],
    age: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: "",
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    // In MVP, we just go to dashboard. Saving to Supabase will be wired later.
    console.log("Saving onboarding data to Supabase:", data);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bio-luminous-bg font-sans bg-background text-foreground">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className={`text-primary hover:opacity-80 transition-opacity ${
              step === 1 || step === 5 ? "invisible" : ""
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-xl font-bold tracking-tighter text-primary">
            BiteSense
          </span>
        </div>
        <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-32 px-6 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <Step1Goal data={data} setData={setData} />}
            {step === 2 && <Step2Diet data={data} setData={setData} />}
            {step === 3 && <Step3Preferences data={data} setData={setData} />}
            {step === 4 && <Step4BodyInfo data={data} setData={setData} />}
            {step === 5 && <Step5Finish />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {step < 5 && (
        <nav className="fixed bottom-0 w-full z-50 bg-background/70 backdrop-blur-xl flex justify-between items-center px-10 py-6 rounded-t-[3rem] shadow-[0_-4px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === step ? "bg-emerald-500" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !data.goal) ||
              (step === 2 && !data.diet) ||
              (step === 4 && (!data.age || !data.weight || !data.height))
            }
            className="bg-gradient-to-br from-emerald-600 to-emerald-400 text-white rounded-full px-8 py-3 font-medium hover:brightness-110 active:scale-95 transition-all duration-300 shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:active:scale-100"
          >
            Next
          </button>
        </nav>
      )}

      {step === 5 && (
        <nav className="fixed bottom-0 w-full z-50 bg-background/70 backdrop-blur-xl flex justify-center items-center px-10 py-6 rounded-t-[3rem] shadow-[0_-4px_40px_rgba(0,0,0,0.04)]">
          <button
            onClick={handleComplete}
            className="w-full max-w-sm bg-gradient-to-br from-emerald-600 to-emerald-400 text-white rounded-full px-8 py-4 font-semibold text-lg hover:brightness-110 active:scale-95 transition-all duration-300 shadow-lg shadow-emerald-600/20"
          >
            Get Started
          </button>
        </nav>
      )}
    </div>
  );
}
