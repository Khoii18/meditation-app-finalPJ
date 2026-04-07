"use client";

export function ThrivingTree() {
  return (
    <div className="w-full relative bg-gradient-to-t from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 mb-8 overflow-hidden flex flex-col items-center justify-end h-64 shadow-xl border border-indigo-500/20">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none" />
      
      {/* Animated Tree/Bonsai Graphic */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          {/* Trunk */}
          <div className="w-4 h-24 bg-amber-900/80 rounded-t-lg mx-auto relative z-0" />
          {/* Leaves (Growing based on level) */}
          <div className="absolute -top-16 -left-12 w-28 h-28 bg-emerald-500 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] mix-blend-screen opacity-80 blur-[2px] animate-pulse" />
          <div className="absolute -top-12 -right-10 w-24 h-24 bg-teal-400 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] mix-blend-screen opacity-80 blur-[2px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -top-20 left-1 w-20 h-20 bg-lime-400 rounded-full mix-blend-screen opacity-70 blur-[3px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="w-32 h-3 bg-black/40 rounded-[100%] blur-sm mt-0" />
      </div>
      
      <div className="absolute top-6 left-8">
        <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Cây Tĩnh Thức Của Bạn</p>
        <h3 className="text-3xl font-serif text-white">Cây Non (Level 4)</h3>
      </div>
    </div>
  );
}
