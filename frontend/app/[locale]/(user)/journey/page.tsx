"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Sparkles, CheckCircle2, PlayCircle, Clock } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { API_URL } from "@/config";

interface JourneyData {
  checkin: any;
  completedExercises: any[];
  advice: string;
  suggestions: any[];
  skills?: any;
}

function JourneyContent() {
  const [data, setData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"progress" | "skills">("progress");

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/journey/today`, {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const updateMood = async (mood: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/checkins/mood`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mood })
      });
      
      if (res.ok) {
        const result = await res.json();
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            checkin: result.checkin || { mood }
          };
        });
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
    <div className="w-full min-h-screen bg-background text-foreground px-4 md:px-8 pt-16 md:pt-24 pb-28 md:pb-10 font-sans transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        
        <header className="mb-0 md:mb-2">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-500 mb-1">Your Stats</p>
          <h1 className="text-2xl md:text-3xl text-foreground font-serif font-medium tracking-tight mb-1.5">My Profile</h1>
          <p className="text-muted text-sm">Your progress, skills, and insights.</p>
        </header>

        <div className="flex items-center gap-6 border-b border-border mb-6">
           <button onClick={() => setTab("progress")} className={`pb-3 text-sm font-semibold transition-colors relative ${tab === 'progress' ? 'text-teal-600' : 'text-muted hover:text-foreground'}`}>
              Progress
              {tab === 'progress' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 rounded-t-full" />}
           </button>
           <button onClick={() => setTab("skills")} className={`pb-3 text-sm font-semibold transition-colors relative ${tab === 'skills' ? 'text-teal-600' : 'text-muted hover:text-foreground'}`}>
              Skills
              {tab === 'skills' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 rounded-t-full" />}
           </button>
        </div>

        {tab === 'progress' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center text-teal-600">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <Activity className="w-4.5 h-4.5" />
                </motion.div>
              </div>
              <h2 className="text-base font-semibold text-foreground opacity-90">Daily Check-in</h2>
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
                <div className="flex justify-between items-center bg-background p-3 rounded-2xl">
                  <span className="text-muted text-sm">Energy</span>
                  <span className="text-teal-600 font-semibold text-sm">{checkin.energy || "Not set"}</span>
                </div>
                <div className="flex justify-between items-center bg-background p-3 rounded-2xl">
                  <span className="text-muted text-sm">Sleep</span>
                  <span className="text-teal-600 font-semibold text-sm">{checkin.sleep || "Not set"}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <p className="text-muted text-sm">How are you feeling today?</p>
                <div className="flex justify-center gap-3">
                  {MOODS.map(m => (
                    <button
                      key={m.label}
                      onClick={() => updateMood(m.label)}
                      className="text-2xl hover:scale-130 transition-transform bg-background p-3 rounded-xl hover:bg-teal-500/10"
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-teal-500/5 border border-teal-500/20 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
                <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  <Sparkles className="w-4.5 h-4.5" strokeWidth={2.5}/>
                </motion.div>
              </div>
              <h2 className="text-base font-semibold text-foreground opacity-90">Insights</h2>
            </div>
            <p className="text-foreground/80 leading-relaxed text-sm font-medium">"{advice}"</p>
          </motion.div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface border border-border rounded-3xl p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold text-foreground opacity-90 mb-4">Completed Today</h2>
            <div className="space-y-2.5">
              {completedExercises?.length > 0 ? (
                completedExercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 bg-background border border-border p-3.5 rounded-2xl">
                    <CheckCircle2 className="w-4.5 h-4.5 text-teal-500 shrink-0" />
                    <span className="text-foreground/80 font-medium text-sm">{ex.name || ex.title}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted text-sm py-6 text-center bg-background rounded-2xl">
                  No sessions completed yet today
                </div>
              )}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface border border-border rounded-3xl p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold text-foreground opacity-90 mb-4">Suggested For You</h2>
            <div className="space-y-2.5">
              {suggestions?.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-background hover:bg-teal-500/5 hover:border-teal-500/20 border border-transparent transition-colors p-3.5 rounded-2xl cursor-pointer group">
                  <div>
                    <h3 className="text-foreground/90 font-semibold text-sm group-hover:text-teal-600 transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
                      <span className="uppercase tracking-wider text-[10px] text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full font-bold">{item.type}</span>
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
        <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface border border-border rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
              
              <div className="relative z-10 mb-8">
                <h2 className="text-xl font-serif font-bold text-foreground">Mastery & Growth</h2>
                <p className="text-xs text-muted font-medium mt-1">Track your evolution across core mindfulness disciplines.</p>
              </div>

              <div className="grid grid-cols-1 gap-8 relative z-10">
                {[
                  { name: "Focus & Clarity", key: "focus", desc: "Sharpening your mental edge", icon: <Activity className="w-5 h-5 text-teal-500" />, color: "bg-teal-500" },
                  { name: "Body & Relaxation", key: "relaxation", desc: "Release of physical tension", icon: <Sparkles className="w-5 h-5 text-amber-500" />, color: "bg-amber-500" },
                  { name: "Mindful Awareness", key: "awareness", desc: "Presence in the current moment", icon: <CheckCircle2 className="w-5 h-5 text-indigo-500" />, color: "bg-indigo-500" },
                  { name: "Breath Mastery", key: "breathControl", desc: "Control of the life force", icon: <Clock className="w-5 h-5 text-rose-500" />, color: "bg-rose-500" }
                ].map((skill, idx) => {
                  const points = (data?.skills as any)?.[skill.key] || 0;
                  const level = Math.floor(points / 20) + 1;
                  const progress = ((points % 20) / 20) * 100;

                  return (
                    <motion.div 
                      key={skill.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group"
                    >
                      <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                          {skill.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-end mb-2">
                            <div>
                              <h3 className="font-bold text-[15px] text-foreground leading-none">{skill.name}</h3>
                              <p className="text-[10px] text-muted font-medium mt-1 uppercase tracking-wider">{skill.desc}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-black text-foreground uppercase tracking-widest bg-background px-3 py-1 rounded-full border border-border shadow-sm">Level {level}</span>
                            </div>
                          </div>
                          <div className="relative h-2 w-full bg-background rounded-full overflow-hidden border border-border p-0.5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(8, progress)}%` }} 
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className={`h-full rounded-full ${skill.color} shadow-[0_0_10px_rgba(20,184,166,0.2)]`} 
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="mt-10 p-5 bg-background/50 rounded-3xl border border-dashed border-border flex items-center justify-center">
                 <p className="text-[10px] text-muted italic text-center leading-relaxed">
                   Complete sessions to earn Mastery Points. Each level requires 20 points of dedicated practice.
                 </p>
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
