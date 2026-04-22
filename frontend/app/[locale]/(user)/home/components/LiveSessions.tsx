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
    <section className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-serif font-medium text-slate-800">Live Sessions</h3>
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
            className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white shadow-sm border border-teal-100 active:scale-95 transition-transform cursor-pointer hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex flex-col items-center justify-center bg-teal-50 border border-teal-100 rounded-2xl text-teal-600 font-serif">
                <span className="text-[11px] font-bold uppercase">{session.time?.split(":")[0] || "18"}</span>
                <span className="text-[11px] font-bold uppercase leading-none">{session.time?.split(":")[1] || "00"}</span>
              </div>
              <div className="max-w-[150px] sm:max-w-[180px]">
                <h4 className="font-semibold text-slate-800 text-[13px] mb-0.5 leading-tight truncate">{session.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium truncate">{session.instructor}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className={`text-[9px] uppercase font-bold tracking-wider flex items-center gap-1 ${session.isLive ? 'text-rose-600' : 'text-teal-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${session.isLive ? 'bg-rose-500 animate-pulse' : 'bg-teal-500'}`} />
                {session.isLive ? 'LIVE NOW' : 'UPCOMING'}
              </span>
              <button className={`text-[11px] font-bold transition-colors shadow-sm ${session.isLive ? 'text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100' : 'text-slate-500 hover:text-teal-600 border border-slate-200 px-3 py-1.5 rounded-lg bg-white hover:border-teal-300'}`}>
                 {session.isLive ? 'Join Now' : 'Notify me'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
