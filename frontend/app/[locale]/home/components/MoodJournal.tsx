"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function MoodJournal() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const moods = [
    { emoji: "😠", label: "Tức giận" },
    { emoji: "😔", label: "Buồn bã" },
    { emoji: "😐", label: "Bình thường" },
    { emoji: "😌", label: "Bình yên" },
    { emoji: "🤩", label: "Hạnh phúc" },
  ];

  const handleSubmit = () => {
    if (selectedMood !== null) setSubmitted(true);
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-slate-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm mb-8">
      {!submitted ? (
        <>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4 text-center">
            Bạn đang cảm thấy thế nào?
          </h3>
          <div className="flex justify-between items-center mb-6">
            {moods.map((mood, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMood(idx)}
                className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all ${selectedMood === idx ? 'bg-indigo-50 dark:bg-indigo-500/20 scale-110 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                <span className="text-3xl lg:text-4xl">{mood.emoji}</span>
              </button>
            ))}
          </div>

          {selectedMood !== null && (
            <div className="animate-in fade-in slide-in-from-top-4">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú nhanh lý do..."
                className="w-full bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={handleSubmit} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors">
                Ghi nhận
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4 animate-in zoom-in">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Đã lưu cảm xúc!</h3>
          <p className="text-sm text-slate-500 mt-1">Cảm ơn bạn đã check-in ngày hôm nay.</p>
        </div>
      )}
    </div>
  );
}
