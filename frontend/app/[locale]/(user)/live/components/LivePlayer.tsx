"use client";

import { Play, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function LivePlayer() {
  const [activeSession, setActiveSession] = useState<any>(null);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/live");
        if (res.ok) {
          const data = await res.json();
          // Find currently live session
          const liveNow = data.find((s: any) => s.isLive);
          setActiveSession(liveNow || data[0] || null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLive();
  }, []);

  if (!activeSession) return <div className="w-full aspect-video rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-slate-500">No sessions available</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full aspect-video rounded-[2.5rem] bg-slate-900 relative overflow-hidden group shadow-2xl">
        <img src={activeSession.image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200"} alt="Live session preview" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        
        {activeSession.isLive && (
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-rose-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Live Now</span>
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform pointer-events-auto shadow-xl">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-2xl font-medium text-white mb-1">{activeSession.title}</h2>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1"><Users className="w-4 h-4"/> {activeSession.instructor}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {activeSession.participants || Math.floor(Math.random() * 500) + 50} listening</span>
          </div>
        </div>
      </div>
    </div>
  );
}
