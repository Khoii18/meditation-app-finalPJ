"use client";

import { Award } from "lucide-react";

export function RecentBadges() {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
      <h3 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100 mb-6">Recent Badges</h3>
      <ul className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <li key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-100">7-Day Harmony</h4>
              <p className="text-xs text-slate-500 mt-0.5">Completed 7 days in a row</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
