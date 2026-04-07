"use client";

import { Moon, Timer } from "lucide-react";

export function SleepHeader() {
  return (
    <header className="mb-12 flex justify-between items-end">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-indigo-100 mb-2 flex items-center gap-3">
          <Moon className="w-10 h-10 text-indigo-400 fill-current" /> Sleep
        </h1>
        <p className="text-indigo-200/70">Tìm lại sự bình yên để bước vào giấc ngủ sâu.</p>
      </div>
      
      <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 px-4 py-2 rounded-full transition-colors text-sm">
        <Timer className="w-4 h-4" /> Sleep Timer
      </button>
    </header>
  );
}
