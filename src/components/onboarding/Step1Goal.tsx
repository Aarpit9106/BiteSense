import { Activity, Dumbbell, Scale, Sparkles, Droplets } from "lucide-react";
import type { OnboardingData } from "./OnboardingWizard";

const GOALS = [
  { id: "weight loss", label: "Weight Loss", desc: "Calorie deficit & metabolism boost", icon: Activity },
  { id: "muscle gain", label: "Muscle Gain", desc: "Protein focus & hypertrophy", icon: Dumbbell },
  { id: "maintenance", label: "Maintenance", desc: "Sustainable habits & steady energy", icon: Scale },
  { id: "longevity", label: "Longevity", desc: "Cellular health & anti-aging", icon: Sparkles },
  { id: "diabetic friendly", label: "Diabetic Friendly", desc: "Glycemic control & stability", icon: Droplets, special: true },
];

export default function Step1Goal({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400">Step 1 of 5</span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 leading-tight">
          What is your primary health goal?
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          We&apos;ll tailor your nutrition plan and daily insights based on your core focus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GOALS.map((goal) => {
          const isSelected = data.goal === goal.id;
          const Icon = goal.icon;
          return (
            <div
              key={goal.id}
              onClick={() => setData({ ...data, goal: goal.id })}
              className={`glass-card group relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[160px] ${
                isSelected
                  ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                  : "border-border/50 hover:border-emerald-500/40"
              } ${goal.id === "maintenance" ? "md:col-span-2 md:flex-row md:items-center md:gap-6" : ""}`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`p-3 rounded-full transition-colors ${
                    isSelected
                      ? "bg-emerald-500 text-white"
                      : goal.special
                      ? "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                {goal.special && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-orange-500/20 text-orange-700 dark:text-orange-300">
                    Specialized
                  </span>
                )}
              </div>
              <div className={goal.id === "maintenance" ? "flex-grow" : "mt-4"}>
                <h3 className="text-lg font-semibold tracking-tight">{goal.label}</h3>
                <p className="text-sm text-muted-foreground">{goal.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
