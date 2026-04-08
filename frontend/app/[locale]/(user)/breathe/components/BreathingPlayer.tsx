"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type BreathState = "inhale" | "hold" | "exhale" | "rest";

export function BreathingPlayer() {
  const [phase, setPhase] = useState<BreathState>("rest");
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);

  // 4-7-8 Breathing Technique
  const phases: Record<BreathState, { text: string; duration: number; scale: number; borderRadius: string }> = {
    inhale: { text: "Inhale slowly...", duration: 4, scale: 1.5, borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" },
    hold: { text: "Hold your breath", duration: 7, scale: 1.5, borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%" },
    exhale: { text: "Exhale gently...", duration: 8, scale: 1, borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
    rest: { text: "Prepare yourself", duration: 0, scale: 1, borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%" }
  };

  useEffect(() => {
    if (!started) return;
    let isActive = true;

    const runCycle = async () => {
      if (!isActive) return;
      setPhase("inhale");
      await new Promise(r => setTimeout(r, phases.inhale.duration * 1000));
      
      if (!isActive) return;
      setPhase("hold");
      await new Promise(r => setTimeout(r, phases.hold.duration * 1000));
      
      if (!isActive) return;
      setPhase("exhale");
      await new Promise(r => setTimeout(r, phases.exhale.duration * 1000));

      if (isActive) runCycle();
    };

    runCycle();

    return () => {
      isActive = false;
    };
  }, [started]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] text-white flex flex-col font-sans overflow-hidden">
      <div className="relative z-10 flex justify-between items-center px-6 py-6 pt-12">
        <Link href="./home" className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
          <X className="w-6 h-6" />
        </Link>
        <div className="text-center absolute left-1/2 -translate-x-1/2">
          <h2 className="font-serif text-xl tracking-wide">Flow State</h2>
        </div>
        <button className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
        <div className="relative w-64 h-64 flex items-center justify-center mb-16">
          <motion.div 
            animate={{ 
              scale: phases[phase].scale,
              borderRadius: phases[phase].borderRadius
            }}
            transition={{ duration: phases[phase].duration, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 blur-sm opacity-80"
            style={{ borderRadius: "50%" }}
          />
          <div className="absolute inset-4 bg-white/20 rounded-full blur-xl animate-pulse" />
        </div>

        <div className="h-20 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-3xl font-serif font-medium text-blue-50 tracking-wide text-center"
            >
              {phases[phase].text}
            </motion.h1>
          </AnimatePresence>
        </div>

        {!started ? (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setStarted(true)}
            className="mt-12 px-8 py-3 bg-white text-indigo-900 font-semibold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
          >
            Start Breathing
          </motion.button>
        ) : (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1 }}
             className="mt-12"
          >
            <Link 
              href="./home"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full border border-white/20 transition-colors backdrop-blur-md"
            >
              End Session
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
