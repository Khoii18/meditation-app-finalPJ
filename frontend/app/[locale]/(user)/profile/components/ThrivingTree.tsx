"use client";

import { useState, useEffect } from "react";

export function ThrivingTree() {
  const [level, setLevel] = useState(1);
  const [levelName, setLevelName] = useState("Seed");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          const currentStreak = data.stats?.currentStreak || 0;
          const calculatedLevel = Math.floor(currentStreak / 3) + 1;
          setLevel(calculatedLevel);

          if (calculatedLevel === 1) setLevelName("Seed");
          else if (calculatedLevel < 5) setLevelName("Sprout");
          else if (calculatedLevel < 10) setLevelName("Young Tree");
          else setLevelName("Thriving Tree");
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchUser();
  }, []);

  return (
    <div className="w-full relative bg-gradient-to-t from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 mb-8 overflow-hidden flex flex-col items-center justify-end h-64 shadow-xl border border-indigo-500/20">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none" />
      
      {/* Animated Tree/Bonsai Graphic */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative" style={{ transform: `scale(${Math.min(1 + level * 0.1, 1.5)})` }}>
          {/* Trunk */}
          <div className="w-4 h-24 bg-amber-900/80 rounded-t-lg mx-auto relative z-0" />
          {/* Leaves (Growing based on level) */}
          <div className="absolute -top-16 -left-12 w-28 h-28 bg-emerald-500 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] mix-blend-screen opacity-80 blur-[2px] animate-pulse" />
          <div className="absolute -top-12 -right-10 w-24 h-24 bg-teal-400 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] mix-blend-screen opacity-80 blur-[2px] animate-pulse" style={{ animationDelay: '1s' }} />
          {level >= 3 && (
            <div className="absolute -top-20 left-1 w-20 h-20 bg-lime-400 rounded-full mix-blend-screen opacity-70 blur-[3px] animate-pulse" style={{ animationDelay: '2s' }} />
          )}
        </div>
        
        <div className="w-32 h-3 bg-black/40 rounded-[100%] blur-sm mt-0" />
      </div>
      
      <div className="absolute top-6 left-8">
        <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Your Mindfulness Tree</p>
        <h3 className="text-3xl font-serif text-white">{levelName} (Level {level})</h3>
      </div>
    </div>
  );
}
