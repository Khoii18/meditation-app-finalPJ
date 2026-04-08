"use client";

import { Flame } from "lucide-react";

export function StreakDisplay({ currentStreak }: { currentStreak: number }) {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(244,63,94,0.5)]">
      <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4">
        <Flame className="w-64 h-64 text-white" />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30">
          <Flame className="w-12 h-12 text-white fill-white" />
        </div>
        <h2 className="text-6xl md:text-8xl font-serif font-medium text-white mb-2">{currentStreak}</h2>
        <p className="text-white/80 font-medium tracking-widest uppercase text-sm">Day Streak</p>
      </div>
    </div>
  );
}
