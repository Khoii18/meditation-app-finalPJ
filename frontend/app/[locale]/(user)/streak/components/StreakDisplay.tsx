"use client";

import { Flame } from "lucide-react";
import { motion } from "framer-motion";

export function StreakDisplay({ currentStreak }: { currentStreak: number }) {
  // Cap intensity so it doesn't break the layout at huge streaks
  const intensity = Math.min(currentStreak, 30);
  
  // Animation duration: starts at 2.5s, gets faster as streak increases (min 0.6s)
  const duration = Math.max(0.6, 2.5 - (intensity * 0.06));
  
  // Scale max gets larger as streak goes up
  const scaleMax = 1 + (intensity * 0.015);
  
  // Add rotation wobble if streak is at least 3
  const wobble = currentStreak >= 3 ? [- (intensity * 0.2), (intensity * 0.2), - (intensity * 0.2)] : [0, 0, 0];

  return (
    <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(244,63,94,0.5)]">
      {/* Background ambient flame */}
      <motion.div 
        animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 origin-center"
      >
        <Flame className="w-64 h-64 text-white" />
      </motion.div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Core Flame Icon */}
        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30 relative">
          
          {/* Particle effect for streak >= 7 */}
          {currentStreak >= 7 && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-white/40 rounded-full"
            />
          )}

          {/* SVG Gradient definition trick for Lucide Icons */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="fire-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ffedd5" />  {/* Super hot core (orange-50) */}
                <stop offset="30%" stopColor="#fde047" /> {/* Yellow */}
                <stop offset="70%" stopColor="#f97316" /> {/* Orange */}
                <stop offset="100%" stopColor="#e11d48" /> {/* Red/Rose tail */}
              </linearGradient>
            </defs>
          </svg>

          <motion.div
            style={{ transformOrigin: "bottom center" }}
            animate={{
              scale: [1, 1.08, 1],
              filter: [
               `drop-shadow(0 0 ${10 + intensity * 0.5}px rgba(255, 200, 0, 0.3))`,
               `drop-shadow(0 0 ${20 + intensity}px rgba(249, 115, 22, 0.7))`,
               `drop-shadow(0 0 ${10 + intensity * 0.5}px rgba(255, 200, 0, 0.3))`
              ]
            }}
            transition={{
              duration: 3.5, // Slow, meditative breathing pace
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Flame className="w-12 h-12" style={{ fill: "url(#fire-gradient)", stroke: "url(#fire-gradient)" }} />
          </motion.div>
        </div>
        
        {/* Metric Number */}
        <motion.h2 
          key={currentStreak}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-6xl md:text-8xl font-serif font-medium text-white mb-2 filter drop-shadow-lg"
        >
          {currentStreak}
        </motion.h2>
        <p className="text-white/80 font-medium tracking-widest uppercase text-sm drop-shadow-md">Day Streak</p>
      </div>
    </div>
  );
}
