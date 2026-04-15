import type { OnboardingData } from "./OnboardingWizard";

const ACTIVITY_LEVELS = ["Low", "Moderate", "High", "Very High"];

export default function Step4BodyInfo({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400">Step 4 of 5</span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 leading-tight">
          Personal details
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          We use this to calculate your Base Metabolic Rate (BMR) accurately.
        </p>
      </div>

      <div className="glass-card p-6 md:p-8 rounded-3xl border border-border/50 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Age</label>
            <input
              type="number"
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="e.g. 28"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Gender</label>
            <select
              value={data.gender}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Weight (kg)</label>
            <input
              type="number"
              value={data.weight}
              onChange={(e) => setData({ ...data, weight: e.target.value })}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="0.0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Height (cm)</label>
            <input
              type="number"
              value={data.height}
              onChange={(e) => setData({ ...data, height: e.target.value })}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border/50">
          <label className="text-sm font-medium text-muted-foreground block">Activity Level</label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITY_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setData({ ...data, activityLevel: level.toLowerCase() })}
                className={`px-4 py-2 rounded-full border transition-all ${
                  data.activityLevel === level.toLowerCase()
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-surface border-border hover:border-emerald-500/40"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
