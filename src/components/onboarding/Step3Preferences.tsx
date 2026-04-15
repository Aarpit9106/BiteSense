import { Check } from "lucide-react";
import type { OnboardingData } from "./OnboardingWizard";

const PREFERENCES = [
  { id: "high protein", label: "High Protein", desc: "Prioritize protein-rich meals" },
  { id: "low carb", label: "Low Carb", desc: "Minimize carbohydrates like rice/bread" },
  { id: "low fat", label: "Low Fat", desc: "Light on oils and heavy fats" },
  { id: "high fiber", label: "High Fiber", desc: "Lots of veggies and whole grains" },
];

export default function Step3Preferences({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
}) {
  const togglePreference = (id: string) => {
    if (data.preferences.includes(id)) {
      setData({ ...data, preferences: data.preferences.filter((p) => p !== id) });
    } else {
      setData({ ...data, preferences: [...data.preferences, id] });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400">Step 3 of 5</span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 leading-tight">
          Any specific focus?
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Select all that apply to help fine-tune your macro recommendations.
        </p>
      </div>

      <div className="space-y-4">
        {PREFERENCES.map((pref) => {
          const isSelected = data.preferences.includes(pref.id);
          return (
            <div
              key={pref.id}
              onClick={() => togglePreference(pref.id)}
              className={`glass-card p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                isSelected
                  ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                  : "border-border/50 hover:border-emerald-500/40"
              }`}
            >
              <div>
                <h3 className="text-lg font-medium">{pref.label}</h3>
                <p className="text-sm text-muted-foreground">{pref.desc}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? "bg-emerald-500 text-white" : "border-2 border-muted-foreground/30"
                }`}
              >
                {isSelected && <Check className="w-4 h-4" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
