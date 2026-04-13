"use client";

import { Star, CheckCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ConstellationMap() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        // ✅ Fixed: use correct endpoint /api/users/me
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          const streak = user.stats?.currentStreak || 0;
          const sessions = user.stats?.totalSessions || 0;
          setCurrentStreak(streak);
          setTotalSessions(sessions);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  // Correct logic:
  // - Days BEFORE the current active day are "completed"
  // - The NEXT day after streak is "active" (the day you are on)
  // - All others are "locked"
  // e.g. streak=2 → Day 1 completed, Day 2 completed, Day 3 active, Day 4-10 locked
  const orbitPosition = currentStreak % 10; // 0-9 within the 10-day orbit
  const activeDay = orbitPosition + 1; // day 1-10

  const nodes = Array.from({ length: 10 }).map((_, i) => {
    const day = i + 1;
    let status: "completed" | "active" | "locked" = "locked";
    if (day < activeDay) status = "completed";
    else if (day === activeDay) status = "active";

    const isEven = i % 2 === 0;
    const x = isEven ? "30%" : "70%";
    const y = `${(i + 1) * 9}%`;

    return { day, status, x, y };
  });

  return (
    <div className="w-full min-h-screen bg-[#050510] text-indigo-100 overflow-hidden relative font-sans pt-12 pb-24">
      {/* Dynamic Star background */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen" 
        style={{
          backgroundImage: "radial-gradient(ellipse at top, #1b2735 0%, #090a0f 100%)"
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 px-4"
        >
          <h1 className="text-4xl text-white font-serif font-medium mb-2">Mindful Orbit</h1>
          <p className="text-indigo-300/80 text-sm">A 10-day journey to unlock cognitive potential.</p>

          {/* Live stats summary synced with streak */}
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-indigo-300">{currentStreak}</span>
              <span className="text-indigo-400/70 text-xs uppercase tracking-widest">Day Streak</span>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-violet-300">{totalSessions}</span>
              <span className="text-indigo-400/70 text-xs uppercase tracking-widest">Sessions</span>
            </div>
          </div>
        </motion.header>

        <div className="relative h-[800px] w-full mt-4">
          {/* Constellation Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M 30% 9% L 70% 18% L 30% 27% L 70% 36% L 30% 45% L 70% 54% L 30% 63% L 70% 72% L 30% 81% L 70% 90%"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>

          {/* Render Nodes */}
          {nodes.map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: node.x, top: node.y }}
            >
              <div className="relative group cursor-pointer flex flex-col items-center">
                {/* Pulsing ring for active node */}
                {node.status === "active" && (
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 bg-indigo-500 rounded-full blur-lg" 
                  />
                )}
                
                {/* Visual Node */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-10 transition-transform ${
                  node.status === "completed" ? "bg-white text-indigo-900 border-4 border-indigo-200" :
                  node.status === "active" ? "bg-gradient-to-tr from-indigo-500 to-violet-500 text-white border-2 border-white/50 scale-110" :
                  "bg-white/5 border border-white/10 text-white/30"
                }`}>
                  {node.status === "completed" && <CheckCircle className="w-6 h-6" />}
                  {node.status === "active" && <Star className="w-6 h-6 fill-current" />}
                  {node.status === "locked" && <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                </div>

                {/* Label */}
                <div className="absolute top-16 whitespace-nowrap bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 text-xs font-semibold tracking-widest text-indigo-100">
                  DAY {node.day}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
