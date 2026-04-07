"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

export function DailyCheckInModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    // Show only once per session or day. Using simple timeout for demo.
    const hasCheckedIn = sessionStorage.getItem("checkedIn");
    if (!hasCheckedIn) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setIsOpen(false);
    sessionStorage.setItem("checkedIn", "true");
  };

  const nextStep = () => {
    if (step === 2) {
      close();
    } else {
      setStep(s => s + 1);
    }
  };

  const questions = [
    { title: "Đêm qua bạn ngủ thế nào?", q1: "Tuyệt vời", q2: "Trằn trọc" },
    { title: "Hiện tại cơ thể bạn cảm thấy ra sao?", q1: "Tràn đầy năng lượng", q2: "Hơi uể oải" },
    { title: "Mục tiêu tĩnh thức hôm nay là gì?", q1: "Tập trung tối đa", q2: "Thả lỏng thư giãn" }
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
            <button onClick={close} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors z-10">
              <X className="w-6 h-6" />
            </button>

            {/* Content mapping */}
            <div className="p-8 pt-16 h-[400px] flex flex-col">
              <div className="flex gap-2 justify-center mb-8">
                {[0, 1, 2].map(i => (
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
                  
                  <div className="w-full space-y-3">
                    <button onClick={nextStep} className="w-full p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-white/5 dark:hover:bg-white/10 text-indigo-700 dark:text-indigo-200 font-medium transition-colors">
                      {questions[step].q1}
                    </button>
                    <button onClick={nextStep} className="w-full p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 font-medium transition-colors">
                      {questions[step].q2}
                    </button>
                  </div>
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
