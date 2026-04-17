"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Sparkles, CheckCircle2, PlayCircle, Clock } from "lucide-react";

interface JourneyData {
  checkin: any;
  completedExercises: any[];
  advice: string;
  suggestions: any[];
}

export default function JourneyPage() {
  const [data, setData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/journey/today", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const updateMood = async (mood: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/checkins/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mood })
      });
      if (data && data.checkin) {
        setData({ ...data, checkin: { ...data.checkin, mood } });
      } else {
        window.location.reload();
      }
    } catch(err) {
      console.error(err);
    }
  };

  const MOODS = [
    { label: "Angry", emoji: "😡" },
    { label: "Sad", emoji: "😢" },
    { label: "Neutral", emoji: "😐" },
    { label: "Peaceful", emoji: "😌" },
    { label: "Happy", emoji: "🤩" }
  ];

  const { checkin, completedExercises, advice, suggestions } = data || { checkin: null, completedExercises: [], advice: "", suggestions: [] };

  return (
    <div className="w-full min-h-screen bg-[#050510] text-indigo-100 p-8 pt-24 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="mb-12">
          <h1 className="text-4xl text-white font-serif font-medium tracking-tight mb-2">Today's Journey</h1>
          <p className="text-indigo-200/60">Your progress, mood, and insights for the day.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* MOOD & STATUS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <Activity className="w-5 h-5" />
                </motion.div>
              </div>
              <h2 className="text-xl font-medium text-white">Daily Check-in</h2>
            </div>
            {checkin ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Mood</span>
                    <div className="flex items-center gap-3">
                      {checkin.mood && MOODS.find(m => m.label === checkin.mood) && (
                        <span className="text-2xl pt-0.5 filter drop-shadow-md">
                          {MOODS.find(m => m.label === checkin.mood)?.emoji}
                        </span>
                      )}
                      <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 text-transparent bg-clip-text">
                        {checkin.mood || "Not set"}
                      </span>
                    </div>
                  </div>
                  {checkin.moodNote && (
                    <div className="bg-white/5 px-4 py-3 rounded-xl border border-indigo-500/20">
                      <p className="text-sm text-indigo-100/80 italic leading-relaxed">
                        "{checkin.moodNote}"
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-sm">Energy</span>
                  <span className="text-indigo-200 font-medium">{checkin.energy || "Not set"}</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-sm">Sleep</span>
                  <span className="text-indigo-200 font-medium">{checkin.sleep || "Not set"}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">You haven't checked in today yet.</p>
              </div>
            )}
          </motion.div>

          {/* AI ADVICE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-900/40 to-violet-900/20 border border-indigo-500/20 rounded-3xl p-6 backdrop-blur-md"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </div>
              <h2 className="text-xl font-medium text-white">AI Insights</h2>
            </div>
            <p className="text-indigo-200/80 leading-relaxed text-lg">
              "{advice}"
            </p>
          </motion.div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* COMPLETED EXERCISES */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md"
          >
            <h2 className="text-xl font-medium text-white mb-6">Completed Today</h2>
            <div className="space-y-3">
              {completedExercises?.length > 0 ? (
                completedExercises.map((ex, i) => (
                  <div key={i} className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]" />
                      </motion.div>
                      <span className="text-emerald-50 font-medium">{ex.name || ex.title}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-sm py-8 text-center bg-black/20 rounded-2xl border border-white/5">
                  No exercises completed yet today.
                </div>
              )}
            </div>
          </motion.div>

          {/* SUGGESTED */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md"
          >
            <h2 className="text-xl font-medium text-white mb-6">Suggested For You</h2>
            <div className="space-y-3">
              {suggestions?.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-black/30 border border-white/5 hover:border-indigo-500/30 transition-colors p-4 rounded-2xl cursor-pointer group">
                  <div>
                    <h3 className="text-white font-medium group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="uppercase tracking-wider text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{item.type}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {item.duration}</span>
                    </div>
                  </div>
                  <PlayCircle className="w-8 h-8 text-indigo-500/50 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
                </div>
              ))}
            </div>
          </motion.div>

        </div>
        
      </div>
    </div>
  );
}
