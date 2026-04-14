"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Loader2, PlayCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function AiCoachView() {
  const router = useRouter();
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const res = await fetch("http://localhost:5000/api/coach/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ mood })
      });

      if (!res.ok) throw new Error("Failed to generate plan");
      
      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-24">
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-slate-800 dark:text-slate-100 mb-4">Mindful AI Coach</h1>
        <p className="text-slate-500 dark:text-slate-400">Artificial Intelligence will generate a precise meditation regimen based on your current emotions and biorhythms.</p>
      </header>

      {!plan ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1C1C1E] p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-indigo-500/5 max-w-2xl mx-auto"
        >
          <form onSubmit={handleGenerate}>
            <label className="block text-lg font-medium text-slate-800 dark:text-slate-100 mb-6 text-center">
              How are you feeling right now?
            </label>
            <textarea 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Example: I'm feeling very stressed about work and having trouble sleeping..."
              className="w-full h-32 bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow mb-6"
            />
            <button 
              disabled={loading || !mood.trim()}
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating your plan...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Generate Plan Now</>
              )}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-indigo-900 to-[#1b2f42] p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Sparkles className="w-64 h-64 text-white" />
          </div>
          
          <div className="relative z-10">
            <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block">Plan Ready</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">{plan.title}</h2>
            <p className="text-white/80 leading-relaxed max-w-xl mb-10">{plan.description}</p>
            
            <div className="space-y-4 mb-10">
              {plan.steps.map((step: any, idx: number) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center gap-6 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-white text-indigo-900 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">{step.name}</h4>
                    <p className="text-indigo-200 text-sm flex items-center gap-2">
                       <Clock className="w-4 h-4"/> {step.duration} • {step.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  // Dùng đường dẫn chuẩn để tránh 404
                  const locale = window.location.pathname.split('/')[1] || 'vi';
                  window.location.href = `/${locale}/home`;
                }}
                className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-white/10"
              >
                <PlayCircle className="w-6 h-6" /> Start Practice
              </button>
              <button onClick={() => setPlan(null)} className="px-8 py-4 rounded-full font-medium text-white hover:bg-white/10 transition-colors">
                Start Over
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
