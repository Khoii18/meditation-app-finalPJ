"use client";

import { Moon, Timer } from "lucide-react";
import { motion } from "framer-motion";

export function SleepHeader() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4"
    >
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-teal-500 mb-1">Rest & Recovery</p>
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-white mb-1 flex items-center gap-2">
          <Moon className="w-7 h-7 text-teal-400 fill-teal-900" /> Sweet Dreams
        </h1>
        <p className="text-slate-400 text-sm">Find your peace and ease into a deep sleep.</p>
      </div>
      <button className="flex items-center gap-2 bg-[#1C2028] hover:bg-[#252A36] text-white px-4 py-2 rounded-xl border border-white/5 transition-colors text-sm font-medium self-start sm:self-auto">
        <Timer className="w-4 h-4 text-slate-400" /> Sleep Timer
      </button>
    </motion.header>
  );
}
