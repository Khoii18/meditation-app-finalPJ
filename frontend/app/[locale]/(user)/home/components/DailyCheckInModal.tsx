"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { API_URL } from "@/config";

export function DailyCheckInModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          const today = new Date().toISOString().split('T')[0];
          
          // Only show if they haven't checked in today according to DB
          // AND they haven't closed it in this specific session already
          const hasDismissed = sessionStorage.getItem("checkedIn_dismissed");

          if (user.stats?.lastCheckInDate !== today && !hasDismissed) {
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
          }
        }
      } catch (err) {
        console.error("Check-in status check failed:", err);
      }
    };

    checkStatus();
  }, []);

  const close = (isSuccess = false) => {
    setIsOpen(false);
    sessionStorage.setItem("checkedIn_dismissed", "true");
    if (isSuccess) {
      // Refresh user data or page to update streak in UI
      window.location.reload();
    }
  };

  const [answers, setAnswers] = useState({ sleep: "", energy: "", goal: "", mood: "" });

  const nextStep = async (answerValue: string) => {
    let newAnswers = { ...answers };
    if (step === 0) newAnswers.sleep = answerValue;
    if (step === 1) newAnswers.energy = answerValue;
    if (step === 2) newAnswers.goal = answerValue;
    if (step === 3) newAnswers.mood = answerValue;
    
    setAnswers(newAnswers);

    if (step === 3) {
      // API Call
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_URL}/api/checkins`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newAnswers)
        });
      } catch (err) {
        console.error(err);
      }
      close(true);
    } else {
      setStep(s => s + 1);
    }
  };

  const questions = [
    { title: "How did you sleep last night?", type: "binary", q1: "Great", q2: "Tossing & Turning" },
    { title: "How does your body feel right now?", type: "binary", q1: "Full of energy", q2: "A bit sluggish" },
    { title: "What is your mindfulness goal today?", type: "binary", q1: "Maximum focus", q2: "Relax and unwind" },
    { title: "How are you feeling?", type: "emoji" }
  ];

  const MOODS = [
    { label: "Angry", emoji: "😡" },
    { label: "Sad", emoji: "😢" },
    { label: "Neutral", emoji: "😐" },
    { label: "Peaceful", emoji: "😌" },
    { label: "Happy", emoji: "🤩" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] shadow-2xl overflow-hidden relative"
          >
            {/* Top close */}
            <button onClick={() => close()} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors z-10">
              <X className="w-6 h-6" />
            </button>

            {/* Content mapping */}
            <div className="p-8 pt-16 h-[400px] flex flex-col">
              <div className="flex gap-2 justify-center mb-8">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-indigo-600' : 'w-4 bg-slate-200 dark:bg-white/10'}`} />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <h3 className="text-2xl font-serif text-slate-800 dark:text-slate-100 mb-8 max-w-xs leading-tight">
                    {questions[step].title}
                  </h3>
                  
                  {questions[step].type === "binary" ? (
                    <div className="w-full space-y-3">
                      <button onClick={() => nextStep(questions[step].q1!)} className="w-full p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-white/5 dark:hover:bg-white/10 text-indigo-700 dark:text-indigo-200 font-medium transition-colors">
                        {questions[step].q1}
                      </button>
                      <button onClick={() => nextStep(questions[step].q2!)} className="w-full p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 font-medium transition-colors">
                        {questions[step].q2}
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-full justify-between px-2">
                      {MOODS.map(m => (
                        <div 
                          key={m.label} 
                          onClick={() => nextStep(m.label)}
                          className="flex flex-col items-center gap-3 cursor-pointer group hover:-translate-y-1 transition-transform"
                        >
                          <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">{m.emoji}</span>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Ambient bottom glow */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
