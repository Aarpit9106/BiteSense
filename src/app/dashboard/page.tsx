"use client";

import Link from "next/link";
import { Camera, Settings, History, Utensils, Heart } from "lucide-react";

const HISTORY_MOCK = [
  { id: 1, name: "Sweetgreen", date: "Today, 1:30 PM", score: 85 },
  { id: 2, name: "Shake Shack", date: "Yesterday, 7:00 PM", score: 40 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background bio-luminous-bg text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 w-full z-40 bg-background/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-sm">
        <span className="text-2xl font-bold tracking-tighter text-primary">BiteSense</span>
        <Link href="/profile" className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      <main className="px-6 py-6 max-w-2xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <section>
          <h1 className="text-3xl font-bold tracking-tight">Hello, Alex!</h1>
          <p className="text-muted-foreground mt-1">Ready to make smart choices today?</p>
          
          <div className="mt-6 glass-card p-6 rounded-[2rem] border border-border/50 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Daily Goal</span>
                <p className="text-3xl font-bold mt-1">Weight Loss</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6 pt-6 border-t border-border/50">
               <div className="flex-1">
                 <p className="text-xs text-muted-foreground">Calorie Goal</p>
                 <p className="font-semibold text-lg">1,800 kcal</p>
               </div>
               <div className="flex-1">
                 <p className="text-xs text-muted-foreground">Protein Target</p>
                 <p className="font-semibold text-lg text-orange-600">120g</p>
               </div>
            </div>
          </div>
        </section>

        {/* Scan Actions */}
        <section className="grid grid-cols-2 gap-4">
          <Link href="/scan" className="glass-card p-6 rounded-[2rem] border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex flex-col items-center text-center group cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-emerald-900 dark:text-emerald-100">Scan Menu</h3>
            <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70 mt-1">Photo or Video</p>
          </Link>

          <div className="glass-card p-6 rounded-[2rem] border border-border/50 hover:bg-surface transition-colors flex flex-col items-center text-center cursor-pointer">
             <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-muted-foreground mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Cheat Meal</h3>
            <p className="text-xs text-muted-foreground mt-1">Toggle relaxed mode</p>
          </div>
        </section>

        {/* History Quick View */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" /> Recent Scans
            </h2>
            <button className="text-sm text-emerald-600 font-semibold">View All</button>
          </div>
          
          <div className="space-y-3">
            {HISTORY_MOCK.map((scan) => (
              <div key={scan.id} className="glass-card p-4 rounded-2xl flex items-center justify-between border-border/50 hover:border-emerald-500/30 transition-colors cursor-pointer">
                <div>
                  <h4 className="font-semibold">{scan.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{scan.date}</p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${scan.score > 70 ? 'text-emerald-600' : 'text-orange-500'}`}>
                    {scan.score} Health Score
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
