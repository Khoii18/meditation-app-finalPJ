"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";

const MOODS = [
  { id: "Angry", label: "Angry", emoji: "😡" },
  { id: "Sad", label: "Sad", emoji: "😢" },
  { id: "Neutral", label: "Neutral", emoji: "😐" },
  { id: "Peaceful", label: "Peaceful", emoji: "😌" },
  { id: "Happy", label: "Happy", emoji: "🤩" },
];

export function MoodJournal() {
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSelect = (id: string) => {
    setSelected(id);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/checkins/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mood: selected, moodNote: note })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 flex flex-col items-center justify-center relative shadow-sm border border-teal-100 w-full">
      <h3 className="text-slate-800 font-serif font-medium text-xl mb-6 text-center">How are you feeling?</h3>
      
      <div className="grid grid-cols-5 w-full max-w-sm gap-2 sm:gap-4 mt-2">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleSelect(mood.id)}
            className="flex flex-col items-center justify-start gap-3 transition-transform hover:-translate-y-1 group relative outline-none w-full"
          >
            <motion.div 
              className={`text-3xl sm:text-4xl leading-none inline-block transition-all duration-300 ${selected && selected !== mood.id ? "opacity-40 grayscale saturate-0" : selected === mood.id ? "scale-125" : "grayscale-0"}`}
              animate={
                selected === mood.id ? { scale: [1, 1.1, 1] } : {}
              }
              transition={{ repeat: selected === mood.id ? Infinity : 0, duration: 2 }}
            >
              {mood.emoji}
            </motion.div>
            <span className={`text-[10px] sm:text-xs font-semibold mt-1 transition-colors text-center w-full truncate ${selected === mood.id ? "text-teal-700" : "text-slate-400 group-hover:text-slate-600"}`}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="w-full flex flex-col gap-3 overflow-hidden origin-top"
          >
            <div className="relative">
              <textarea
                placeholder="Why do you feel this way? (Optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50 border border-teal-100 rounded-2xl px-5 py-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 resize-none h-24 transition-colors"
              />
            </div>
            
            <div className="flex items-center justify-between">
              {saved ? (
                <div className="flex items-center gap-2 text-xs font-medium text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
                  <CheckCircle2 className="w-4 h-4" /> Saved to Journey
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">Data syncs to Journey Tab</div>
              )}
              <button
                onClick={handleSave}
                disabled={loading || saved}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal-500/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {saved ? "Saved" : "Save Log"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
