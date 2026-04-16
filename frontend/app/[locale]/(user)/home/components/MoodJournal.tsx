"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const MOODS = [
  { id: "angry", label: "Angry", emoji: "😡" },
  { id: "sad", label: "Sad", emoji: "😢" },
  { id: "neutral", label: "Neutral", emoji: "😐" },
  { id: "peaceful", label: "Peaceful", emoji: "😌" },
  { id: "happy", label: "Happy", emoji: "🤩" },
];

export function MoodJournal() {
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSelect = (id: string) => {
    setSelected(id);
    setSaved(false);
    // Simulate save
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  return (
    <div className="bg-[#1C1C1E] rounded-[2rem] p-6 lg:p-8 flex flex-col items-center justify-center relative shadow-xl mb-8 border border-white/5 mx-auto">
      <h3 className="text-white font-medium text-lg mb-6">How are you feeling?</h3>
      
      <div className="flex items-center justify-between w-full max-w-sm px-2 gap-2 sm:gap-4">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleSelect(mood.id)}
            className="flex flex-col items-center gap-3 transition-transform hover:-translate-y-1 group"
          >
            <motion.div 
              className={`text-4xl inline-block transition-all duration-300 ${selected && selected !== mood.id ? "opacity-30 grayscale saturate-0" : selected === mood.id ? "scale-125" : "grayscale-0"}`}
              animate={
                mood.id === "angry"
                  ? { rotate: [-5, 5, -5], x: [-1, 1, -1] }
                : mood.id === "sad"
                  ? { y: [0, 4, 0], rotate: [0, -3, 0] }
                : mood.id === "neutral"
                  ? { scale: [1, 1.05, 1], rotate: [-2, 2, -2] }
                : mood.id === "peaceful"
                  ? { y: [0, -4, 0], scale: [1, 1.05, 1] }
                : 
                  { y: [0, -6, 0], rotate: [-4, 4, -4] }
              }
              transition={{
                repeat: Infinity,
                duration: mood.id === "angry" ? 0.3 : mood.id === "happy" ? 0.8 : 2.5,
                ease: "easeInOut"
              }}
            >
              {mood.emoji}
            </motion.div>
            <span className={`text-[10px] sm:text-xs font-medium transition-colors ${selected === mood.id ? "text-slate-200" : "text-slate-500 group-hover:text-slate-300"}`}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      <div className="h-8 mt-6 flex items-center justify-center w-full">
        {selected ? (
          <motion.div 
            key={selected}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm font-medium bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full border border-indigo-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            Feeling {MOODS.find(m => m.id === selected)?.label} Today
          </motion.div>
        ) : (
          <div className="h-8" />
        )}
      </div>
    </div>
  );
}
