"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MoodJournal() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const moods = [
    { emoji: "😠", label: "Angry" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😌", label: "Peaceful" },
    { emoji: "🤩", label: "Happy" },
  ];

  const handleSubmit = () => {
    if (selectedMood !== null) setSubmitted(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-[#1C1C1E] border border-slate-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm mb-8"
    >
      <AnimatePresence mode="wait">
      {!submitted ? (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4 text-center">
            How are you feeling?
          </h3>
          <div className="flex justify-between items-center mb-6">
            {moods.map((mood, idx) => (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                key={idx}
                onClick={() => setSelectedMood(idx)}
                className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all ${selectedMood === idx ? 'bg-indigo-50 dark:bg-indigo-500/20 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                <span className="text-3xl lg:text-4xl">{mood.emoji}</span>
              </motion.button>
            ))}
          </div>

          {selectedMood !== null && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
            >
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Briefly note why..."
                className="w-full bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={handleSubmit} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors">
                Save Note
              </button>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          key="success"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Emotion Saved!</h3>
          <p className="text-sm text-slate-500 mt-1">Thank you for checking in today.</p>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}
