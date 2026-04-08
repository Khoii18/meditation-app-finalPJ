"use client";

export function LiveSchedule() {
  const sessions = [
    { title: "Morning Awakening", instructor: "Master Linh", time: "06:00 AM", participants: 120, image: "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=800", isLive: true },
    { title: "Midday Reset", instructor: "Coach Minh", time: "12:00 PM", participants: 45, image: "https://images.unsplash.com/photo-1522844990619-4951c40f7eda?q=80&w=800", isLive: false },
    { title: "Deep Sleep Preparation", instructor: "Teacher Ha", time: "09:30 PM", participants: 200, image: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=800", isLive: false },
  ];

  return (
    <div>
      <h3 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100 mb-6">Today's Schedule</h3>
      <div className="space-y-4">
        {sessions.map((session, idx) => (
          <div key={idx} className="flex gap-4 p-4 rounded-[1.5rem] bg-white dark:bg-[#1C1C1E] shadow-sm border border-slate-100 dark:border-white/5 cursor-pointer hover:border-indigo-500/30 transition-colors">
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
                <button className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium hover:bg-indigo-50 transition-colors">Remind Me</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
