import { Leaf, Egg, Drumstick, Sprout } from "lucide-react";
import type { OnboardingData } from "./OnboardingWizard";

const DIETS = [
  { id: "vegetarian", label: "Vegetarian", icon: Leaf, desc: "Plant-based, includes dairy" },
  { id: "eggetarian", label: "Eggetarian", icon: Egg, desc: "Vegetarian + eggs" },
  { id: "non veg", label: "Non-Veg", icon: Drumstick, desc: "Includes meat and seafood" },
  { id: "vegan", label: "Vegan", icon: Sprout, desc: "Exclusively plant-based" },
];

export default function Step2Diet({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400">Step 2 of 5</span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 leading-tight">
          What is your diet preference?
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          This helps us filter out recommendations you don&apos;t consume.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DIETS.map((diet) => {
          const isSelected = data.diet === diet.id;
          const Icon = diet.icon;
          return (
            <div
              key={diet.id}
              onClick={() => setData({ ...data, diet: diet.id })}
              className={`glass-card group relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col items-center text-center ${
                isSelected
                  ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                  : "border-border/50 hover:border-emerald-500/40"
              }`}
            >
              <div
                className={`p-4 rounded-full mb-4 transition-colors ${
                  isSelected
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-surface-container-high text-muted-foreground group-hover:text-emerald-500"
                }`}
              >
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{diet.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{diet.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
