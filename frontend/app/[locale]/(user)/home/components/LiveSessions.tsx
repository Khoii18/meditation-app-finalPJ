"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function LiveSessions() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/live");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setSchedule(data);
          } else {
            setSchedule([
              { time: "11:00", title: "Live meditation now available", instructor: "Cuong hoang", isLive: true },
              { time: "12:00", title: "live ngay 2", instructor: "anh", isLive: true }
            ]);
          }
        }
      } catch (err) {
        setSchedule([
          { time: "11:00", title: "Live meditation now available", instructor: "Cuong hoang", isLive: true },
          { time: "12:00", title: "live ngay 2", instructor: "anh", isLive: true }
        ]);
      }
    };
    fetchLive();
  }, []);

  return (
    <section className="px-6 py-6 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100">Live Sessions</h3>
      </div>
      
      <div className="space-y-4">
        {schedule.map((session, idx) => (
          <div 
            key={idx} 
            onClick={() => {
               if (session.isLive) {
                 router.push('./live');
               }
            }}
            className="flex items-center justify-between p-4 rounded-[1.5rem] bg-[#1C1C1E] shadow-xl border border-white/5 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex flex-col items-center justify-center bg-indigo-500/10 rounded-2xl text-indigo-400 font-serif">
                <span className="text-[11px] font-bold uppercase">{session.time?.split(":")[0] || "18"}</span>
                <span className="text-[11px] font-bold uppercase leading-none">{session.time?.split(":")[1] || "00"}</span>
              </div>
              <div className="max-w-[180px]">
                <h4 className="font-medium text-slate-100 text-[13px] mb-0.5 leading-tight truncate">{session.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">{session.instructor}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[9px] uppercase font-bold tracking-wider flex items-center gap-1 ${session.isLive ? 'text-rose-500' : 'text-emerald-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${session.isLive ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                {session.isLive ? 'LIVE NOW' : 'UPCOMING'}
              </span>
              <button className={`text-[11px] font-medium transition-colors ${session.isLive ? 'text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-lg' : 'text-slate-400 hover:text-indigo-400'}`}>
                 {session.isLive ? 'Join Now' : 'Notify me'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
