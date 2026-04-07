"use client";

import { Music, CloudRain, Wind, Flame } from "lucide-react";

export function SleepSounds() {
  const sounds = [
    { name: "Tiếng mưa rào", icon: <CloudRain className="w-6 h-6"/> },
    { name: "Lửa trại", icon: <Flame className="w-6 h-6"/> },
    { name: "Gió đại ngàn", icon: <Wind className="w-6 h-6"/> },
    { name: "Sóng vỗ nhẹ", icon: <Music className="w-6 h-6"/> },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-xl font-medium text-white mb-6">Trộn Âm Thanh Nền</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sounds.map((s, i) => (
          <div key={i} className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group">
            <div className="w-14 h-14 rounded-full bg-indigo-900/40 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              {s.icon}
            </div>
            <span className="text-sm font-medium">{s.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
