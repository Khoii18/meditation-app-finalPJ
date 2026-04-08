"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export function LiveSessions() {
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/live");
        if (res.ok) {
          const data = await res.json();
          setSchedule(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLive();
  }, []);

  if (schedule.length === 0) return null;

  return (
    <section className="px-6 py-6 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100">Live Sessions</h3>
      </div>
      
      <div className="space-y-4">
        {schedule.map((session, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white dark:bg-[#1C1C1E] shadow-sm border border-slate-100 dark:border-white/5 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <span className="text-[10px] font-bold uppercase">{session.time?.split(":")[0] || "18"}</span>
                <span className="text-[10px] font-bold uppercase leading-none">{session.time?.split(":")[1] || "00"}</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-100 text-sm mb-1">{session.title}</h4>
                <p className="text-xs text-slate-500">{session.instructor}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[9px] uppercase font-bold tracking-wider flex items-center gap-1 ${session.isLive ? 'text-rose-500' : 'text-emerald-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${session.isLive ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                {session.isLive ? 'Live Now' : 'Upcoming'}
              </span>
              <button className="text-xs font-semibold text-slate-400 hover:text-indigo-500 transition-colors">Notify me</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
