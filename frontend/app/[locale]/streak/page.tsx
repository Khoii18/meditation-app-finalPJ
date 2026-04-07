"use client";

import { StreakDisplay } from "./components/StreakDisplay";
import { StreakMetrics } from "./components/StreakMetrics";
import { RecentBadges } from "./components/RecentBadges";

export default function StreakPage() {
  const currentStreak = 12;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 xl:px-12 pb-10">
      <header className="py-8">
        <h1 className="text-3xl font-serif font-medium text-slate-800 dark:text-slate-100">Your Journey</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Consistency is the key to mindfulness.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StreakDisplay currentStreak={currentStreak} />
          <StreakMetrics />
        </div>

        <RecentBadges />
      </div>
    </div>
  );
}
