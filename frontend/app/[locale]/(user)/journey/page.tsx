"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Sparkles, CheckCircle2, PlayCircle, Clock } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface JourneyData {
  checkin: any;
  completedExercises: any[];
  advice: string;
  suggestions: any[];
}

function JourneyContent() {
  const [data, setData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"progress" | "skills">("progress");

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
      <div className="min-h-screen bg-[#F2FBFA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
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
    <div className="w-full min-h-screen bg-[#F2FBFA] text-slate-800 px-4 md:px-8 pt-16 md:pt-24 pb-28 md:pb-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        
        <header className="mb-0 md:mb-2">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-500 mb-1">Your Stats</p>
          <h1 className="text-2xl md:text-3xl text-slate-800 font-serif font-medium tracking-tight mb-1.5">My Profile</h1>
          <p className="text-slate-400 text-sm">Your progress, skills, and insights.</p>
        </header>

        {/* Custom Tabs */}
        <div className="flex items-center gap-6 border-b border-teal-100 mb-6">
           <button onClick={() => setTab("progress")} className={`pb-3 text-sm font-semibold transition-colors relative ${tab === 'progress' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}>
              Progress
              {tab === 'progress' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 rounded-t-full" />}
           </button>
           <button onClick={() => setTab("skills")} className={`pb-3 text-sm font-semibold transition-colors relative ${tab === 'skills' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}>
              Skills
              {tab === 'skills' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 rounded-t-full" />}
           </button>
        </div>

        {tab === 'progress' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {/* MOOD & STATUS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-teal-100 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <Activity className="w-4.5 h-4.5" />
                </motion.div>
              </div>
              <h2 className="text-base font-semibold text-slate-700">Daily Check-in</h2>
            </div>
            {checkin ? (
              <div className="space-y-3">
                <div className="flex flex-col gap-3 bg-teal-50/60 p-4 rounded-2xl border border-teal-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Mood</span>
                    <div className="flex items-center gap-2">
                      {checkin.mood && MOODS.find(m => m.label === checkin.mood) && (
                        <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-teal-100 shadow-sm">
                          <span className="text-lg">{MOODS.find(m => m.label === checkin.mood)?.emoji}</span>
                          <span className="text-sm font-medium text-slate-700">{checkin.mood}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {checkin.moodNote && (
                    <div className="bg-white px-4 py-3 rounded-xl border border-teal-100">
                      <p className="text-sm text-slate-600 italic leading-relaxed">"{checkin.moodNote}"</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                  <span className="text-slate-500 text-sm">Energy</span>
                  <span className="text-teal-700 font-semibold text-sm">{checkin.energy || "Not set"}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                  <span className="text-slate-500 text-sm">Sleep</span>
                  <span className="text-teal-700 font-semibold text-sm">{checkin.sleep || "Not set"}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <p className="text-slate-400 text-sm">How are you feeling today?</p>
                <div className="flex justify-center gap-3">
                  {MOODS.map(m => (
                    <button
                      key={m.label}
                      onClick={() => updateMood(m.label)}
                      className="text-2xl hover:scale-130 transition-transform bg-teal-50 p-3 rounded-xl hover:bg-teal-100"
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* INSIGHTS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-teal-50 border border-teal-100/60 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
                <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  <Sparkles className="w-4.5 h-4.5" strokeWidth={2.5}/>
                </motion.div>
              </div>
              <h2 className="text-base font-semibold text-slate-700">Insights</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">"{advice}"</p>
          </motion.div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          
          {/* COMPLETED EXERCISES */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-teal-100 rounded-3xl p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold text-slate-700 mb-4">Completed Today</h2>
            <div className="space-y-2.5">
              {completedExercises?.length > 0 ? (
                completedExercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 bg-teal-50 border border-teal-100 p-3.5 rounded-2xl">
                    <CheckCircle2 className="w-4.5 h-4.5 text-teal-500 shrink-0" />
                    <span className="text-slate-700 font-medium text-sm">{ex.name || ex.title}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-sm py-6 text-center bg-slate-50 rounded-2xl">
                  No sessions completed yet today
                </div>
              )}
            </div>
          </motion.div>
          {/* SUGGESTED */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-teal-100 rounded-3xl p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold text-slate-700 mb-4">Suggested For You</h2>
            <div className="space-y-2.5">
              {suggestions?.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-slate-50 hover:bg-teal-50 hover:border-teal-100 border border-transparent transition-colors p-3.5 rounded-2xl cursor-pointer group">
                  <div>
                    <h3 className="text-slate-700 font-semibold text-sm group-hover:text-teal-700 transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="uppercase tracking-wider text-[10px] text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full font-bold">{item.type}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{item.duration}</span>
                    </div>
                  </div>
                  <PlayCircle className="w-7 h-7 text-teal-300 group-hover:text-teal-500 group-hover:scale-110 transition-all" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        </>
      ) : (
        <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-teal-100 rounded-3xl p-6 shadow-sm"
            >
              <h2 className="text-base font-semibold text-slate-700 mb-6">Meditation Skills</h2>
              <div className="space-y-6">
                
                {/* Simulated Skill 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-teal-100 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-6 h-6 text-teal-500" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-sm text-slate-800">Breath Focus</span>
                      <span className="text-xs text-slate-400">Level 2</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-2/3 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Simulated Skill 2 */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-teal-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-teal-400" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-sm text-slate-800">Body Scan</span>
                      <span className="text-xs text-slate-400">Level 1</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 w-1/3 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Simulated Skill 3 */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-teal-100 flex items-center justify-center flex-shrink-0 opacity-50">
                    <Clock className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 opacity-50">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-sm text-slate-500">Labeling</span>
                      <span className="text-xs text-slate-400">Level 1</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-300 w-1/4 rounded-full" />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default function JourneyPage() {
  return (
    <ProtectedRoute>
      <JourneyContent />
    </ProtectedRoute>
  );
}
