"use client";

import { Award, Flame, Star, Trophy, Zap } from "lucide-react";

// Badge definitions — unlocked at specific streak milestones
const BADGE_MILESTONES = [
  { streak: 1,  name: "First Step",    desc: "Completed your first day",      icon: Flame,  color: "text-orange-400", bg: "bg-orange-900/30" },
  { streak: 3,  name: "3-Day Flow",    desc: "Completed 3 days in a row",     icon: Zap,    color: "text-yellow-400", bg: "bg-yellow-900/30" },
  { streak: 7,  name: "7-Day Harmony", desc: "Completed 7 days in a row",     icon: Award,  color: "text-amber-400",  bg: "bg-amber-900/30"  },
  { streak: 14, name: "Fortnight Zen", desc: "Completed 14 days in a row",    icon: Star,   color: "text-indigo-400", bg: "bg-indigo-900/30" },
  { streak: 30, name: "Monthly Peace", desc: "Completed 30 days in a row",    icon: Trophy, color: "text-violet-400", bg: "bg-violet-900/30" },
];

interface RecentBadgesProps {
  currentStreak: number;
  longestStreak: number;
}

export function RecentBadges({ currentStreak, longestStreak }: RecentBadgesProps) {
  // Unlocked if longestStreak ever reached the milestone
  const unlockedBadges = BADGE_MILESTONES.filter(b => longestStreak >= b.streak);

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
      <h3 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100 mb-1">Badges Earned</h3>
      <p className="text-xs text-slate-500 mb-6">Based on your longest streak: {longestStreak} days</p>

      {unlockedBadges.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Complete your first meditation streak to earn badges!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {unlockedBadges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <li key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                <div className={`w-12 h-12 rounded-full ${badge.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${badge.color}`} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-slate-100">{badge.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{badge.desc}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Progress to next badge */}
      {(() => {
        const nextBadge = BADGE_MILESTONES.find(b => longestStreak < b.streak);
        if (!nextBadge) return null;
        const progress = Math.min((longestStreak / nextBadge.streak) * 100, 100);
        return (
          <div className="mt-6 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
            <p className="text-xs text-slate-500 mb-2">Next: <span className="text-slate-700 dark:text-slate-300 font-medium">{nextBadge.name}</span> ({nextBadge.streak} days)</p>
            <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1 text-right">{longestStreak}/{nextBadge.streak} days</p>
          </div>
        );
      })()}
    </div>
  );
}
