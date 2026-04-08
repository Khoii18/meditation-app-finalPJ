"use client";

import { Star, Zap, CalendarDays } from "lucide-react";

export function StreakMetrics({ stats }: { stats: any }) {
  const metrics = [
    { label: "Longest Streak", value: `${stats?.longestStreak || 0} Days`, icon: <Star className="w-5 h-5 text-amber-500" /> },
    { label: "Total Sessions", value: `${stats?.totalSessions || 0}`, icon: <Zap className="w-5 h-5 text-indigo-500" /> },
    { label: "Mindful Minutes", value: `${stats?.mindfulMinutes || 0}`, icon: <CalendarDays className="w-5 h-5 text-emerald-500" /> },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((m, idx) => (
        <div key={idx} className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-slate-100 dark:border-white/5 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
            {m.icon}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{m.value}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">{m.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
