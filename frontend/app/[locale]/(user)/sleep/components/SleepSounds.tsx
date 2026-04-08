"use client";

import { Music, CloudRain, Wind, Flame } from "lucide-react";
import { motion } from "framer-motion";

export function SleepSounds() {
  const sounds = [
    { name: "Heavy Rain", icon: <CloudRain className="w-6 h-6"/> },
    { name: "Campfire", icon: <Flame className="w-6 h-6"/> },
    { name: "Forest Wind", icon: <Wind className="w-6 h-6"/> },
    { name: "Gentle Waves", icon: <Music className="w-6 h-6"/> },
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="mb-12"
    >
      <h2 className="text-xl font-medium text-white mb-6">Mix Soundscapes</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sounds.map((s, i) => (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={i} 
            className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group"
          >
            <div className="w-14 h-14 rounded-full bg-indigo-900/40 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              {s.icon}
            </div>
            <span className="text-sm font-medium text-slate-200">{s.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
