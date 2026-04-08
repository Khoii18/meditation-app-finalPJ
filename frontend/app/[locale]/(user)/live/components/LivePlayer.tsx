"use client";

import { Play, Users } from "lucide-react";

export function LivePlayer() {
  return (
    <div className="flex flex-col gap-6">
      <div className="w-full aspect-video rounded-[2.5rem] bg-slate-900 relative overflow-hidden group shadow-2xl">
        <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200" alt="Live session preview" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-6 left-6 flex items-center gap-2 bg-rose-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-500/30">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Live Now</span>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-2xl font-medium text-white mb-1">Morning Awakening</h2>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1"><Users className="w-4 h-4"/> Master Linh</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 120 listening</span>
          </div>
        </div>
      </div>
    </div>
  );
}
