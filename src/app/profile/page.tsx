"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User, LogOut, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background bio-luminous-bg text-foreground">
      {/* Header */}
      <header className="sticky top-0 w-full z-40 bg-background/80 backdrop-blur-xl px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => router.back()} className="text-primary hover:opacity-80">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold tracking-tighter text-primary">Profile</span>
      </header>

      <main className="px-6 py-8 max-w-xl mx-auto space-y-8">
        {/* User Info */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4 border-4 border-background shadow-lg">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-headline">Alex Johnson</h2>
          <p className="text-muted-foreground mt-1">alex@example.com</p>
        </div>

        {/* Profile Details List */}
        <div className="glass-card rounded-[2rem] border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-white/30 dark:bg-black/30 hover:bg-white/50 cursor-pointer">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Health Goal</p>
              <p className="font-semibold">Weight Loss</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-white/30 dark:bg-black/30 hover:bg-white/50 cursor-pointer">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Dietary Preference</p>
              <p className="font-semibold">Non-Veg</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-white/30 dark:bg-black/30 hover:bg-white/50 cursor-pointer">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Target Macros</p>
              <p className="font-semibold">High Protein, Low Carb</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="p-4 flex justify-between items-center bg-white/30 dark:bg-black/30 hover:bg-white/50 cursor-pointer">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Body Profile</p>
              <p className="font-semibold">Female, 28y, 70kg, 170cm</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Log Out */}
        <button className="w-full flex justify-center items-center gap-2 p-4 rounded-full border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-colors font-semibold">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </main>
    </div>
  );
}
