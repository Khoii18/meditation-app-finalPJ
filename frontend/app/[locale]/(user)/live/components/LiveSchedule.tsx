"use client";

import { useEffect, useState } from "react";

export function LiveSchedule() {
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

  if (schedule.length === 0) return <div className="text-slate-500">No scheduled sessions.</div>;

  return (
    <div>
      <h3 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100 mb-6">Today's Schedule</h3>
      <div className="space-y-4">
        {schedule.map((session, idx) => (
          <div key={session._id || idx} className="flex gap-4 p-4 rounded-[1.5rem] bg-white dark:bg-[#1C1C1E] shadow-sm border border-slate-100 dark:border-white/5 cursor-pointer hover:border-indigo-500/30 transition-colors">
            <div className="w-24 h-24 rounded-2xl overflow-hidden relative flex-shrink-0">
              <img src={session.image} alt="session" className="absolute inset-0 w-full h-full object-cover" />
              {session.isLive && (
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse border border-white" />
              )}
            </div>
            <div className="flex-1 py-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-slate-800 dark:text-slate-100">{session.title}</h4>
                <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">{session.time}</span>
              </div>
              <p className="text-sm text-slate-500 mb-auto">{session.instructor}</p>
              <div className="flex gap-2">
                <button className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${session.isLive ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50'}`}>
                  {session.isLive ? 'Join Now' : 'Remind Me'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
