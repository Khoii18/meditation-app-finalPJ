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
    <div className="bg-[#1C1C1E] rounded-[2rem] p-6 lg:p-8 flex flex-col items-center justify-center relative shadow-xl mb-8 border border-white/5 w-full">
      <h3 className="text-white font-medium text-lg mb-6 text-center">How are you feeling?</h3>
      
      <div className="flex items-center justify-between w-full max-w-sm px-1 sm:px-2 gap-2 sm:gap-4">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleSelect(mood.id)}
            className="flex flex-col items-center gap-3 transition-transform hover:-translate-y-1 group relative outline-none"
          >
            <motion.div 
              className={`text-3xl sm:text-4xl leading-none inline-block transition-all duration-300 ${selected && selected !== mood.id ? "opacity-30 grayscale saturate-0" : selected === mood.id ? "scale-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "grayscale-0"}`}
              animate={
                selected === mood.id ? { scale: [1, 1.1, 1] } : {}
              }
              transition={{ repeat: selected === mood.id ? Infinity : 0, duration: 2 }}
            >
              {mood.emoji}
            </motion.div>
            <span className={`text-[10px] sm:text-xs font-medium transition-colors ${selected === mood.id ? "text-slate-200" : "text-slate-500 group-hover:text-slate-300"}`}>
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
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none h-24 transition-colors"
              />
            </div>
            
            <div className="flex items-center justify-between">
              {saved ? (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> Saved to Journey
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">Data syncs to Journey Tab</div>
              )}
              <button
                onClick={handleSave}
                disabled={loading || saved}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
