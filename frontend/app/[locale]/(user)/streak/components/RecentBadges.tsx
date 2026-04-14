"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Award, Star, Crown, Sparkles, Lock, CheckCircle2, X, Gift } from "lucide-react";

// ─── Reward Milestones ──────────────────────────────────────────────────────
const MILESTONES = [
  {
    day: 1,
    name: "First Breath",
    desc: "Completed your first day",
    reward: "Unlock: Basic Meditation Pack",
    rewardDetail: "Access to 5 starter meditation sessions curated for beginners.",
    emoji: "🔥",
    icon: Flame,
    gradient: "from-orange-500 to-red-500",
    glow: "shadow-orange-500/40",
    bgCard: "from-orange-950/60 to-red-950/40",
    border: "border-orange-500/30",
  },
  {
    day: 3,
    name: "Finding Rhythm",
    desc: "3 days of consistency",
    reward: "Unlock: Sleep Sound Library",
    rewardDetail: "7 premium sleep soundscapes including rain, ocean waves & forest.",
    emoji: "⚡",
    icon: Zap,
    gradient: "from-yellow-400 to-amber-500",
    glow: "shadow-yellow-500/40",
    bgCard: "from-yellow-950/60 to-amber-950/40",
    border: "border-yellow-500/30",
  },
  {
    day: 7,
    name: "7-Day Harmony",
    desc: "One full week mastered",
    reward: "Unlock: AI Coach Premium",
    rewardDetail: "Personalized meditation plans powered by AI based on your mood.",
    emoji: "🏅",
    icon: Award,
    gradient: "from-indigo-500 to-violet-500",
    glow: "shadow-indigo-500/40",
    bgCard: "from-indigo-950/60 to-violet-950/40",
    border: "border-indigo-500/30",
  },
  {
    day: 14,
    name: "Deep Seeker",
    desc: "Two weeks of mindfulness",
    reward: "Unlock: Advanced Sessions",
    rewardDetail: "Deep work, breathwork & body scan sessions for experienced meditators.",
    emoji: "🌟",
    icon: Star,
    gradient: "from-sky-400 to-cyan-500",
    glow: "shadow-sky-500/40",
    bgCard: "from-sky-950/60 to-cyan-950/40",
    border: "border-sky-500/30",
  },
  {
    day: 30,
    name: "Mindful Master",
    desc: "30 days — a true habit",
    reward: "Unlock: Lifetime Badge + Full Library",
    rewardDetail: "Complete access to every course, live session & coach content forever.",
    emoji: "👑",
    icon: Crown,
    gradient: "from-violet-500 to-pink-500",
    glow: "shadow-violet-500/40",
    bgCard: "from-violet-950/60 to-pink-950/40",
    border: "border-violet-500/30",
  },
];

interface RewardsPanelProps {
  currentStreak: number;
  longestStreak: number;
}

export function RecentBadges({ currentStreak, longestStreak }: RewardsPanelProps) {
  const [selected, setSelected] = useState<(typeof MILESTONES)[0] | null>(null);

  const isUnlocked = (day: number) => longestStreak >= day;

  // Find the next milestone to unlock
  const nextMilestone = MILESTONES.find(m => !isUnlocked(m.day));
  const progressToNext = nextMilestone
    ? Math.min((longestStreak / nextMilestone.day) * 100, 100)
    : 100;

  return (
    <>
      <div className="bg-white dark:bg-[#141418] rounded-[2rem] border border-slate-100 dark:border-white/5 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-serif font-semibold text-slate-800 dark:text-slate-100">
              Streak Rewards
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Best streak: <span className="text-violet-400 font-semibold">{longestStreak} days</span>
            {" · "}Current: <span className="text-orange-400 font-semibold">{currentStreak} days</span>
          </p>
        </div>

        {/* Progress to next milestone */}
        {nextMilestone && (
          <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-500">
                Next: <span className="font-semibold text-slate-700 dark:text-slate-300">{nextMilestone.emoji} {nextMilestone.name}</span>
              </span>
              <span className="text-xs font-mono text-slate-400">{longestStreak}/{nextMilestone.day}d</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${nextMilestone.gradient}`}
              />
            </div>
          </div>
        )}

        {/* Milestone list */}
        <div className="p-4 space-y-2">
          {MILESTONES.map((m, i) => {
            const unlocked = isUnlocked(m.day);
            const Icon = m.icon;

            return (
              <motion.button
                key={i}
                whileHover={{ scale: unlocked ? 1.01 : 1 }}
                whileTap={{ scale: unlocked ? 0.99 : 1 }}
                onClick={() => unlocked && setSelected(m)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left
                  ${unlocked
                    ? `bg-gradient-to-r ${m.bgCard} border ${m.border} cursor-pointer hover:brightness-110`
                    : "bg-white/5 dark:bg-white/[0.02] border border-white/5 cursor-default opacity-60"
                  }`}
              >
                {/* Icon */}
                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  unlocked
                    ? `bg-gradient-to-br ${m.gradient} shadow-lg ${m.glow}`
                    : "bg-slate-200 dark:bg-white/10"
                }`}>
                  {unlocked
                    ? <Icon className="w-6 h-6 text-white" />
                    : <Lock className="w-5 h-5 text-slate-400" />
                  }
                  {unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${unlocked ? "text-white" : "text-slate-400"}`}>
                      {m.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      unlocked ? "bg-white/10 text-white/70" : "bg-white/5 text-slate-500"
                    }`}>
                      Day {m.day}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 truncate ${unlocked ? "text-white/60" : "text-slate-500"}`}>
                    {unlocked ? `🎁 ${m.reward}` : m.desc}
                  </p>
                </div>

                {/* Tap hint */}
                {unlocked && (
                  <Gift className="w-4 h-4 text-white/40 flex-shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Reward Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className={`relative w-full max-w-sm rounded-3xl border overflow-hidden ${selected.border}`}
              style={{ background: "rgba(10,10,20,0.95)" }}
            >
              {/* Glow bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${selected.bgCard} opacity-60`} />

              {/* Header glow orb */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-[60px] bg-gradient-to-br ${selected.gradient} opacity-30`} />

              <div className="relative z-10 p-7">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badge icon */}
                <div className="flex justify-center mb-5">
                  <motion.div
                    animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selected.gradient} shadow-2xl ${selected.glow} flex items-center justify-center`}
                  >
                    <selected.icon className="w-10 h-10 text-white" />
                  </motion.div>
                </div>

                {/* Badge info */}
                <div className="text-center mb-6">
                  <p className="text-3xl mb-1">{selected.emoji}</p>
                  <h2 className="text-2xl font-serif font-bold text-white mb-1">{selected.name}</h2>
                  <p className="text-sm text-white/50">{selected.desc}</p>
                </div>

                {/* Reward box */}
                <div className={`rounded-2xl border ${selected.border} bg-white/5 p-5`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className={`w-4 h-4 bg-gradient-to-br ${selected.gradient} rounded p-0.5 text-white`} />
                    <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">Reward Unlocked</span>
                  </div>
                  <p className="text-white font-semibold text-sm mb-2">{selected.reward}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{selected.rewardDetail}</p>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className={`mt-4 w-full py-3 rounded-2xl bg-gradient-to-r ${selected.gradient} text-white font-semibold text-sm shadow-lg ${selected.glow} transition-all hover:brightness-110`}
                >
                  Awesome! 🎉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
