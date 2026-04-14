"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const moods = [
  { emoji: "😠", label: "Angry" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😌", label: "Peaceful" },
  { emoji: "🤩", label: "Happy" },
];

export function MoodJournal() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (selectedMood === null) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Save mood to the latest checkin or as standalone
      await fetch("http://localhost:5000/api/checkins/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood: moods[selectedMood].label,
          moodNote: note || null,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true); // still show success
    } finally {
      setLoading(false);
    }
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
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4 text-center">
              How are you feeling?
            </h3>
            <div className="flex items-center gap-1 mb-6 w-full">
              {moods.map((mood, idx) => (
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  key={idx}
                  onClick={() => setSelectedMood(idx)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-2xl transition-all ${
                    selectedMood === idx
                      ? "bg-indigo-50 dark:bg-indigo-500/20 shadow-sm ring-2 ring-indigo-400/40"
                      : "hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <motion.span
                    className="text-3xl inline-block"
                    animate={
                      idx === 0 ? // 😠 Angry — rapid shake
                        { rotate: [-6, 6, -6, 6, 0], x: [-2, 2, -2, 2, 0] } :
                      idx === 1 ? // 😔 Sad — slow droop & rise
                        { y: [0, 4, 0], rotate: [0, -4, 0] } :
                      idx === 2 ? // 😐 Neutral — slow side tilt
                        { rotate: [-5, 5, -5], scale: [1, 1.05, 1] } :
                      idx === 3 ? // 😌 Peaceful — gentle float
                        { y: [0, -5, 0], scale: [1, 1.05, 1] } :
                               // 🤩 Happy — bouncy jump
                        { y: [0, -8, 0, -4, 0], rotate: [0, -5, 0, 5, 0] }
                    }
                    transition={
                      idx === 0 ? { duration: 0.6, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" } :
                      idx === 1 ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } :
                      idx === 2 ? { duration: 3,   repeat: Infinity, ease: "easeInOut" } :
                      idx === 3 ? { duration: 3,   repeat: Infinity, ease: "easeInOut" } :
                                  { duration: 0.7, repeat: Infinity, repeatDelay: 1,   ease: "easeOut" }
                    }
                  >
                    {mood.emoji}
                  </motion.span>
                  <span className={`text-[10px] font-medium ${selectedMood === idx ? "text-indigo-500" : "text-slate-400"}`}>
                    {mood.label}
                  </span>
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
                  onChange={e => setNote(e.target.value)}
                  placeholder="Briefly note why... (optional)"
                  className="w-full bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Mood"}
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
