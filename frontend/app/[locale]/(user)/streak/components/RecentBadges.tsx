"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Award, Star, Crown, Sparkles, Lock, CheckCircle2, X, Gift, ExternalLink, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

// ─── Reward Milestones ──────────────────────────────────────────────────────
const MILESTONES = [
  {
    id: "streak-1",
    day: 1,
    name: "First Breath",
    desc: "Day 1",
    reward: "Unlock: Basic Meditation Pack",
    rewardDetail: "Access to the 'Foundation' series of meditations to start your journey.",
    targetUrl: "/plans",
    emoji: "🔥",
    icon: Flame,
    gradient: "from-orange-500 to-red-500",
    glow: "shadow-orange-500/40",
    bgCard: "from-orange-950/60 to-red-950/40",
    border: "border-orange-500/30",
  },
  {
    id: "streak-3",
    day: 3,
    name: "Finding Rhythm",
    desc: "Day 3",
    reward: "Unlock: Sleep Sound Library",
    rewardDetail: "New premium soundscapes added to your Sleep library.",
    targetUrl: "/sleep",
    emoji: "⚡",
    icon: Zap,
    gradient: "from-yellow-400 to-amber-500",
    glow: "shadow-yellow-500/40",
    bgCard: "from-yellow-950/60 to-amber-950/40",
    border: "border-yellow-500/30",
  },
  {
    id: "streak-7",
    day: 7,
    name: "7-Day Harmony",
    desc: "Day 7",
    reward: "Unlock: AI Coach Premium",
    rewardDetail: "Unlock advanced AI analysis of your meditation progress.",
    targetUrl: "/ai-coach",
    emoji: "🏅",
    icon: Award,
    gradient: "from-indigo-500 to-violet-500",
    glow: "shadow-indigo-500/40",
    bgCard: "from-indigo-950/60 to-violet-950/40",
    border: "border-indigo-500/30",
  },
  {
    id: "streak-14",
    day: 14,
    name: "Deep Seeker",
    desc: "Day 14",
    reward: "Unlock: Advanced Sessions",
    rewardDetail: "Special Body Scan & Focus sessions unlocked for you.",
    targetUrl: "/plans",
    emoji: "🌟",
    icon: Star,
    gradient: "from-sky-400 to-cyan-500",
    glow: "shadow-sky-500/40",
    bgCard: "from-sky-950/60 to-cyan-950/40",
    border: "border-sky-500/30",
  },
  {
    id: "streak-30",
    day: 30,
    name: "Mindful Master",
    desc: "Day 30",
    reward: "Unlock: Special Badge",
    rewardDetail: "Exclusive 'Mindful Master' badge and full sound library unlocked.",
    targetUrl: "/profile",
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
  claimedRewards: string[];
  onClaimed: () => void;
}

export function RecentBadges({ currentStreak, longestStreak, claimedRewards, onClaimed }: RewardsPanelProps) {
  const [selected, setSelected] = useState<(typeof MILESTONES)[0] | null>(null);
  const [claiming, setClaiming] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const isUnlocked = (day: number) => longestStreak >= day;
  const isClaimed = (id: string) => claimedRewards.includes(id);

  // Find the next milestone to unlock
  const nextMilestone = MILESTONES.find(m => !isUnlocked(m.day));
  const progressToNext = nextMilestone
    ? Math.min((longestStreak / nextMilestone.day) * 100, 100)
    : 100;

  const handleClaim = async (milestone: (typeof MILESTONES)[0]) => {
    if (isClaimed(milestone.id)) {
      router.push(`/${locale}${milestone.targetUrl}`);
      return;
    }

    setClaiming(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/me/claim-reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rewardId: milestone.id })
      });

      if (res.ok) {
        onClaimed();
        setTimeout(() => {
          setSelected(null);
          router.push(`/${locale}${milestone.targetUrl}`);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-[#0F1115] rounded-[2.5rem] border border-slate-100 dark:border-white/[0.05] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100 dark:border-white/[0.05] bg-gradient-to-br from-white to-slate-50 dark:from-[#15181E] dark:to-[#0F1115]">
          <div className="flex items-center gap-2.5 mb-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            <h3 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100">
              Streak Rewards
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Best: <span className="text-teal-500 font-bold">{longestStreak} days</span>
            {" · "}Current: <span className="text-orange-500 font-bold">{currentStreak} days</span>
          </p>
        </div>

        {/* Progress Display */}
        {nextMilestone && (
          <div className="px-8 py-5 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/[0.05]">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Upcoming Milestone</p>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {nextMilestone.emoji} {nextMilestone.name}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-teal-500">{longestStreak} <span className="text-slate-400">/ {nextMilestone.day}d</span></span>
            </div>
            <div className="h-2.5 bg-slate-200 dark:bg-white/[0.08] rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${nextMilestone.gradient} shadow-lg shadow-teal-500/20`}
              />
            </div>
          </div>
        )}

        {/* Milestones List */}
        <div className="p-5 space-y-3">
          {MILESTONES.map((m, i) => {
            const unlocked = isUnlocked(m.day);
            const claimed = isClaimed(m.id);
            const Icon = m.icon;

            return (
              <motion.button
                key={i}
                whileHover={{ scale: unlocked ? 1.02 : 1 }}
                whileTap={{ scale: unlocked ? 0.98 : 1 }}
                onClick={() => unlocked && setSelected(m)}
                className={`w-full flex items-center gap-4 p-5 rounded-[1.75rem] transition-all duration-300 text-left relative group
                  ${unlocked
                    ? `bg-gradient-to-r ${m.bgCard} border ${m.border} cursor-pointer`
                    : "bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.03] cursor-default opacity-40"
                  }`}
              >
                {/* Background Glow on unlocked */}
                {unlocked && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${m.gradient} opacity-0 group-hover:opacity-5 rounded-[1.75rem] transition-opacity`} />
                )}

                {/* Icon Container */}
                <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                  unlocked
                    ? `bg-gradient-to-br ${m.gradient} shadow-xl ${m.glow} group-hover:scale-110`
                    : "bg-slate-200 dark:bg-white/10"
                }`}>
                  {unlocked
                    ? <Icon className="w-7 h-7 text-white" />
                    : <Lock className="w-5 h-5 text-slate-400" />
                  }
                  
                  {unlocked && (
                    <div className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#15181E] shadow-md
                      ${claimed ? "bg-teal-500" : "bg-orange-500"}`}>
                      {claimed ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Gift className="w-3.5 h-3.5 text-white animate-bounce" />}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${unlocked ? "text-white" : "text-slate-500"}`}>
                      {m.name}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold tracking-tighter uppercase ${
                      unlocked ? "bg-white/20 text-white/90" : "bg-slate-300 dark:bg-white/5 text-slate-500"
                    }`}>
                      {m.desc}
                    </span>
                  </div>
                  <p className={`text-xs font-medium truncate ${unlocked ? "text-white/70" : "text-slate-500"}`}>
                    {claimed ? `✓ Claimed` : unlocked ? `🎁 ${m.reward}` : "Keep going..."}
                  </p>
                </div>

                {/* Action Indicator */}
                {unlocked && !claimed && (
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="p-2 bg-white/10 rounded-full"
                  >
                    <Gift className="w-4 h-4 text-white" />
                  </motion.div>
                )}
                {claimed && (
                    <ExternalLink className="w-4 h-4 text-white/40" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Modal - Reward Details */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => !claiming && setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className={`relative w-full max-w-sm rounded-[3rem] border-2 overflow-hidden ${selected.border} shadow-2xl`}
              style={{ background: "#0A0B0E" }}
            >
              {/* Animated Light Strips */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${selected.gradient} opacity-50`} />
              
              <div className="relative z-10 p-10 pt-12">
                <button
                  onClick={() => setSelected(null)}
                  disabled={claiming}
                  className="absolute top-6 right-6 text-white/20 hover:text-white/60 transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Big Reward Icon */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        boxShadow: ["0 0 20px rgba(0,0,0,0.5)", `0 0 40px ${isClaimed(selected.id) ? '#2DD4BF44' : '#F9731644'}`, "0 0 20px rgba(0,0,0,0.5)"]
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <div className={`w-28 h-28 rounded-[2rem] bg-gradient-to-br ${selected.gradient} p-0.5 shadow-2xl`}>
                        <div className="w-full h-full rounded-[1.95rem] bg-[#0A0B0E] flex items-center justify-center">
                          <selected.icon className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className={`absolute -inset-4 bg-gradient-to-br ${selected.gradient} opacity-20 blur-3xl rounded-full -z-10`}
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center mb-8">
                    <motion.p 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-teal-400 font-bold tracking-widest text-[10px] uppercase mb-2"
                    >
                        Milestone Reached!
                    </motion.p>
                  <h2 className="text-3xl font-serif font-bold text-white mb-2">{selected.name}</h2>
                  <p className="text-sm text-slate-400 font-medium">{selected.desc}</p>
                </div>

                {/* Reward Highlight */}
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-6 mb-8 text-center">
                  <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.05]">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Your Reward</span>
                  </div>
                  <p className="text-white font-bold text-lg mb-2">{selected.reward}</p>
                  <p className="text-slate-500 text-xs leading-relaxed px-2">
                    {selected.rewardDetail}
                  </p>
                </div>

                {/* Main Action Button */}
                <button
                  onClick={() => handleClaim(selected)}
                  disabled={claiming}
                  className={`w-full py-5 rounded-[1.5rem] bg-gradient-to-br ${selected.gradient} text-white font-bold text-base shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3`}
                >
                  {claiming ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isClaimed(selected.id) ? (
                    <>Go to Reward <ExternalLink className="w-5 h-5" /></>
                  ) : (
                    <>Claim Reward Now! 🎉</>
                  )}
                </button>
                
                <p className="text-center mt-4 text-[10px] text-slate-600 font-medium">
                  {isClaimed(selected.id) ? "You already added this to your library." : "The reward will be permanently linked to your account."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
