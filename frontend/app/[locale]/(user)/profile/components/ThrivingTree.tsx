"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LEVEL_MAP = [
  { name: "Quiet Seed", min: 1, color: "text-indigo-400", bg: "bg-indigo-500/20", desc: "The beginning of your path." },
  { name: "Eager Sprout", min: 2, color: "text-emerald-400", bg: "bg-emerald-500/20", desc: "Seeking the light of awareness." },
  { name: "Gentle Sapling", min: 3, color: "text-teal-400", bg: "bg-teal-500/20", desc: "Gently swaying in the breath." },
  { name: "Rooted Willow", min: 5, color: "text-emerald-500", bg: "bg-emerald-600/20", desc: "Finding stability in stillness." },
  { name: "Flowering Bodhi", min: 7, color: "text-indigo-500", bg: "bg-indigo-600/20", desc: "Wisdom begins to bloom." },
  { name: "Majestic Oak", min: 10, color: "text-indigo-600", bg: "bg-indigo-700/20", desc: "A pillar of spiritual strength." },
  { name: "Ancient Sage", min: 15, color: "text-purple-400", bg: "bg-purple-500/20", desc: "Infinite peace and clarity." }
];

export function ThrivingTree() {
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState({ streak: 0, sessions: 0 });
  const [levelInfo, setLevelInfo] = useState(LEVEL_MAP[0]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats({ streak: data.stats?.currentStreak || 0, sessions: data.stats?.totalSessions || 0 });
          const calculatedLevel = Math.floor((data.stats?.currentStreak * 0.5) + (data.stats?.totalSessions * 0.2)) + 1;
          const finalLevel = Math.min(calculatedLevel, 20);
          setLevel(finalLevel);
          const info = [...LEVEL_MAP].reverse().find(l => finalLevel >= l.min) || LEVEL_MAP[0];
          setLevelInfo(info);
        }
      } catch (err) { console.error(err); }
    };
    fetchUser();
  }, []);

  const treeScale = 0.8 + (level * 0.03);

  return (
    <div className="w-full relative bg-[#0D0D12] rounded-[3.5rem] p-12 mb-12 overflow-hidden flex items-center justify-center h-[380px] shadow-2xl border border-white/[0.03]">
      {/* Background Starfield */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/20 via-transparent to-transparent" />
      
      {/* Central Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Tree Container */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          animate={{ rotate: [-0.3, 0.3, -0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: `scale(${treeScale})` }}
          className="relative flex flex-col items-center"
        >
          {/* Detailed SVG Bonsai */}
          <svg width="240" height="240" viewBox="0 0 200 200" className="drop-shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <defs>
              <linearGradient id="bark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2D1B14" />
                <stop offset="100%" stopColor="#1A0F0A" />
              </linearGradient>
              <radialGradient id="leafGlow">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ground Mound */}
            <ellipse cx="100" cy="190" rx="60" ry="10" fill="#111827" />
            
            {/* Trunk - Organic & Textured */}
            <path d="M100 190 Q95 150 110 120 T100 60" stroke="url(#bark)" strokeWidth="14" fill="none" strokeLinecap="round" />
            <path d="M100 190 Q105 150 90 120 T100 60" stroke="url(#bark)" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.8" />
            
            {/* Primary Branches */}
            {level >= 2 && (
              <>
                <path d="M105 140 Q130 130 150 100" stroke="url(#bark)" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M95 120 Q70 110 50 80" stroke="url(#bark)" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M100 90 Q120 70 130 40" stroke="url(#bark)" strokeWidth="4" fill="none" strokeLinecap="round" />
              </>
            )}

            {/* Leaf Clusters - Multiple layers for depth */}
            <g className="leaf-layers">
               {/* Base Foliage */}
               <circle cx="100" cy="50" r="35" fill="url(#leafGlow)" opacity="0.4" />
               <circle cx="150" cy="100" r="25" fill="url(#leafGlow)" opacity="0.3" />
               <circle cx="50" cy="80" r="25" fill="url(#leafGlow)" opacity="0.3" />
               
               {/* Level-based Leaves - Client Only */}
               {mounted && [...Array(Math.min(level * 5, 100))].map((_, i) => {
                 const angle = (i / (level * 5)) * Math.PI * 2;
                 const dist = 15 + Math.random() * (20 + level);
                 const x = 100 + Math.cos(angle) * dist + (Math.random() * 40 - 20);
                 const y = 60 + Math.sin(angle) * dist + (Math.random() * 40 - 20);
                 return (
                   <motion.circle 
                     key={i}
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ 
                       scale: [0, 1, 0.8, 1],
                       opacity: [0, 0.8, 0.4, 0.8],
                     }}
                     transition={{
                       duration: 3 + Math.random() * 4,
                       repeat: Infinity,
                       delay: Math.random() * 5,
                       ease: "easeInOut"
                     }}
                     cx={x} cy={y} r={1.5 + Math.random() * 3} 
                     fill={i % 3 === 0 ? "#34D399" : i % 3 === 1 ? "#10B981" : "#6EE7B7"} 
                   />
                 );
               })}

               {/* Right Cluster - Glowing pulse */}
               {mounted && level >= 3 && (
                 <motion.g
                   animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.98, 1.02, 0.98] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 >
                   {[...Array(25)].map((_, i) => (
                      <circle 
                        key={`r-${i}`}
                        cx={150 + (Math.random() * 40 - 20)} 
                        cy={100 + (Math.random() * 40 - 20)} 
                        r={1 + Math.random() * 4} 
                        fill="#059669" 
                        opacity="0.6" 
                      />
                   ))}
                 </motion.g>
               )}

               {/* Left Cluster - Glowing pulse */}
               {mounted && level >= 3 && (
                 <motion.g
                   animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.98, 1.02, 0.98] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 >
                   {[...Array(25)].map((_, i) => (
                      <circle 
                        key={`l-${i}`}
                        cx={50 + (Math.random() * 40 - 20)} 
                        cy={80 + (Math.random() * 40 - 20)} 
                        r={1 + Math.random() * 4} 
                        fill="#059669" 
                        opacity="0.6" 
                      />
                   ))}
                 </motion.g>
               )}
            </g>
          </svg>
        </motion.div>
        
        {/* Ground Dust / Particles */}
        {mounted && [...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100],
              x: (i % 2 === 0 ? [0, 20] : [0, -20]),
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
            style={{ bottom: '20px', left: `${20 + i * 15}%` }}
          />
        ))}
        
        {/* Soft Shadow on Ground */}
        <div className="w-40 h-3 bg-black/40 rounded-[100%] blur-md -mt-2" />
      </div>

      {/* Floating Labels - Minimalist & Elegant */}
      <div className="absolute inset-0 p-16 flex flex-col justify-between pointer-events-none">
        <div className="flex flex-col gap-1">
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]"
          >
            Evolutionary State
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-serif text-white tracking-tight"
          >
            {levelInfo.name}
          </motion.h2>
          <div className="flex items-center gap-4 mt-2">
            <span className={`px-4 py-1 rounded-full ${levelInfo.bg} ${levelInfo.color} text-[10px] font-bold tracking-widest border border-white/5`}>
              LEVEL {level}
            </span>
            <span className="text-white/40 text-xs italic">{levelInfo.desc}</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex gap-12">
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Total Streak</p>
              <p className="text-3xl font-serif text-white">{stats.streak} <span className="text-sm text-white/40">Days</span></p>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Completed</p>
              <p className="text-3xl font-serif text-white">{stats.sessions} <span className="text-sm text-white/40">Sessions</span></p>
            </div>
          </div>
          
          {/* Zen Inspiration */}
          <div className="text-right max-w-[200px]">
            <p className="text-[10px] text-white/30 leading-relaxed italic">
              "Like a tree, your mindfulness grows strongest when the roots are deep in daily practice."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
