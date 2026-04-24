"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_URL } from "@/config";

export function DailyHero() {
  const [day, setDay] = useState(1);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const userRes = await fetch(`${API_URL}/api/users/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (userRes.ok) {
          const userData = await userRes.json();

          const currentStreak = userData.stats?.currentStreak || 0;
          const currentDay = Math.min(currentStreak + 1, 30);
          setDay(currentDay);

          if (userData.activePlan && userData.activePlan.lessons) {
            const plan = userData.activePlan;
            const lessonIndex = currentDay - 1;
            const lesson = plan.lessons[lessonIndex] || plan.lessons[0];
            
              setSuggestion({
                title: lesson.title,
                planTitle: plan.title,
                note: lesson.description || plan.description,
                contentId: {
                  _id: plan._id,
                  image: plan.image,
                  duration: lesson.duration || plan.duration
                },
                lessonIndex: lessonIndex
              });
          } else {
            // Fallback to admin recommendations
            const recRes = await fetch(`${API_URL}/api/recommendations`);
            if (recRes.ok) {
              const recs = await recRes.json();
              const todayRec = recs.find((r: any) => r.day === currentDay);
              if (todayRec) {
                setSuggestion(todayRec);
              }
            }
          }
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const title = suggestion ? (suggestion.title || suggestion.contentId?.title) : "Starting Your Journey";
  const note = suggestion?.note || "A mindful start to your day.";
  const linkHref = suggestion?.contentId 
    ? `./play/${suggestion.contentId._id}${suggestion.lessonIndex !== undefined ? `?lessonIndex=${suggestion.lessonIndex}` : ""}`
    : "./journey";
  const bgImage = suggestion?.contentId?.image || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop";

  return (
    <section className="w-full">
      <Link href={linkHref} className="block w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[300px] rounded-[2.5rem] overflow-hidden cursor-pointer group shadow-xl border border-white/10"
        >
          {/* Unified Background Layer */}
          <div className="absolute inset-0 z-0 h-[300px]">
            <img 
              src={bgImage} 
              alt="Plan Background" 
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          {/* Compact Content Layer */}
          <div className="relative z-10 h-[300px] flex flex-col justify-between p-8">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-500/30 text-teal-400 text-[9px] font-black uppercase tracking-widest shadow-lg">
                Day {day} of 30 • {suggestion?.planTitle || "Morning Path"}
              </span>
              
              <div className="max-w-xl">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-2">
                  {title}
                </h1>
                <p className="text-sm md:text-base text-white/70 font-medium leading-relaxed italic line-clamp-1">
                  "{note}"
                </p>
              </div>

              <div className="flex items-center gap-4">
                <motion.button 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black text-xs transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  <Play className="w-4 h-4 fill-black" />
                  START SESSION
                </motion.button>
                {suggestion?.contentId?.duration && (
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    {suggestion.contentId.duration}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Progress Tracker */}
            <div className="w-full max-w-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Progress: {Math.round((day / 30) * 100)}%</span>
                <span className="text-white/90 text-[10px] font-bold">{30 - day} Days left</span>
              </div>
              <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(day / 30) * 100}%` }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-teal-400 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  );
}
