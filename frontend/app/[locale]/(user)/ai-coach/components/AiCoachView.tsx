"use client";

import { useState, useEffect } from "react";
import { Sparkles, Zap, PlayCircle, Loader2, ShieldCheck, Lock, Crown, Quote, Move, Activity, Eye, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/config";

export default function AiCoachView() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'vi';
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { user } = useAuth();
  const [forcePremium, setForcePremium] = useState(false); 

  const isUserPremium = user?.premiumStatus?.isPremium || user?.claimedRewards?.includes("streak-7");
  const isInputLocked = forcePremium && !isUserPremium;
  const isPremiumUI = forcePremium;

  const handleGenerate = async () => {
    if (isInputLocked) {
        const locale = window.location.pathname.split('/')[1] || 'vi';
        router.push(`/${locale}/pricing`);
        return;
    }
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/ai-coach/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ prompt, mode: forcePremium ? "premium" : "standard" }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const isPremiumAI = result.mode.includes("Premium") || result.mode.includes("Neural") || result.mode.includes("Lunaria Eternal");

    if (isPremiumAI) {
      return (
        <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-6">
           <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#050505] rounded-[2.5rem] border border-indigo-500/20 shadow-2xl overflow-hidden text-white">
              <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-r from-indigo-500/10 to-transparent flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/30"><Crown className="w-6 h-6" /></div>
                    <div>
                       <h2 className="text-xl md:text-2xl font-serif font-bold tracking-tight">Lunaria Protocol</h2>
                       <p className="text-[8px] uppercase tracking-[0.3em] font-black text-indigo-400 opacity-60">Divine Grace Edition</p>
                    </div>
                 </div>
                 <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                       <p className="text-[9px] text-white/40 uppercase font-black">Essence</p>
                       <p className="text-xs font-bold text-emerald-400">{result.metrics?.essence || "Pure"}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="text-right">
                       <p className="text-[9px] text-white/40 uppercase font-black">Center</p>
                       <p className="text-xs font-bold text-indigo-400">{result.metrics?.energyCenter || "Root"}</p>
                    </div>
                 </div>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                 <div className="lg:col-span-4 flex flex-col gap-6">
                    <section className="bg-white/5 p-5 rounded-2xl border border-white/5">
                       <h4 className="flex items-center gap-2 text-[10px] font-black text-indigo-300 uppercase mb-3"><Activity className="w-4 h-4" /> Reflection</h4>
                       <p className="text-base font-serif leading-relaxed italic text-slate-200">"{result.analysis || result.message}"</p>
                    </section>
                    <section className="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20">
                       <h4 className="flex items-center gap-2 text-[10px] font-black text-indigo-300 uppercase mb-3"><Move className="w-4 h-4" /> Posture</h4>
                       <p className="text-xs leading-relaxed text-slate-300 font-medium">{result.exercise?.posture}</p>
                    </section>
                 </div>

                 <div className="lg:col-span-8 flex flex-col gap-8">
                    <section>
                       <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Practice: {result.exercise?.name}</h4>
                       <div className="space-y-3">
                          {result.exercise?.steps?.map((step: any, idx: number) => (
                             <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all">
                                <div className="flex items-start gap-4">
                                   <span className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center font-black text-[10px]">{idx + 1}</span>
                                   <div className="flex-1">
                                      <p className="text-sm text-slate-200 mb-1">{typeof step === 'string' ? step : step.action}</p>
                                      {(step.zenWisdom || step.proTip) && (
                                         <p className="text-[10px] font-bold italic text-emerald-400/80">✦ {step.zenWisdom || step.proTip}</p>
                                      )}
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </section>
                    {result.exercise?.visualization && (
                       <section className="p-6 bg-gradient-to-br from-indigo-600/10 via-transparent to-violet-600/10 border border-white/5 rounded-[2rem] text-center">
                          <h4 className="text-[8px] text-indigo-300 uppercase font-black mb-2">Visualization</h4>
                          <p className="text-lg font-serif text-slate-100 italic">"{result.exercise.visualization}"</p>
                       </section>
                    )}
                 </div>
              </div>

              <div className="p-8 bg-white/5 border-t border-white/5 text-center">
                 <p className="text-base font-serif italic text-white/50 max-w-xl mx-auto">"{result.quote}"</p>
                 <button onClick={() => setResult(null)} className="mt-4 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-[10px] transition-all uppercase tracking-widest border border-white/10">Reset Guide</button>
              </div>
           </motion.div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-[2.5rem] shadow-xl border border-border p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-teal-500/10 text-teal-600 rounded-xl"><Sparkles className="w-5 h-5" /></div>
               <h3 className="text-xl font-serif font-bold text-foreground">Sacred Support</h3>
            </div>
            <p className="text-lg font-serif italic text-foreground/90 leading-relaxed mb-8">"{result.message}"</p>
            <div className="space-y-3 mb-8">
               {result.exercise?.steps?.map((step: string, idx: number) => (
                  <div key={idx} className="p-4 bg-background border border-border rounded-xl flex items-center gap-4">
                     <span className="w-6 h-6 bg-teal-600 text-white rounded-lg flex items-center justify-center font-black text-[10px]">{idx + 1}</span>
                     <p className="text-muted text-sm">{step}</p>
                  </div>
               ))}
            </div>
            <div className="pt-6 border-t border-border flex flex-col items-center">
               <p className="text-xl font-serif italic text-teal-600 dark:text-teal-400 text-center mb-8">"{result.quote}"</p>
               <div className="flex gap-4 w-full">
                  <button onClick={() => router.push(`/${locale}/home`)} className="flex-1 py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-transform">Dashboard</button>
                  <button onClick={() => setResult(null)} className="px-8 py-4 border border-border text-muted rounded-xl font-bold hover:bg-background transition-colors">Retry</button>
               </div>
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-6 overflow-hidden">
      <div className="flex flex-col items-center mb-6">
          <div className={`p-4 rounded-3xl mb-4 shadow-xl transition-all duration-500 scale-75 md:scale-100 ${isPremiumUI ? "bg-indigo-500 rotate-12 shadow-indigo-500/40" : "bg-teal-600"}`}>
             {isPremiumUI ? <Zap className="w-6 h-6 text-white fill-current" /> : <Sparkles className="w-6 h-6 text-white" />}
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-center mb-2 italic leading-tight text-foreground">Lunaria</h1>
          <p className="text-muted text-center max-w-md text-xs md:text-sm mb-6">Your ancient guide to inner stillness.</p>

          <div className="bg-surface p-1 rounded-full flex items-center gap-1 w-full max-w-sm shadow-inner border border-border">
             <button onClick={() => setForcePremium(false)}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${!forcePremium ? "bg-background text-teal-600 shadow-sm border border-border" : "text-muted"}`}>
                Standard
             </button>
             <button onClick={() => setForcePremium(true)}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${forcePremium ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "text-muted"}`}>
                Premium
             </button>
          </div>
      </div>

      <div className={`relative transition-all duration-500 p-6 md:p-10 rounded-[3rem] border overflow-hidden ${isPremiumUI ? "bg-[#0A0A0C] border-indigo-500/20 shadow-2xl" : "bg-surface border-border shadow-xl"}`}>
          <div className="relative z-10 flex flex-col items-center">
            <h3 className={`text-lg font-serif font-bold mb-6 text-center ${isPremiumUI ? "text-white" : "text-foreground"}`}>
              {isPremiumUI ? "Speak your heart to Lunaria..." : "How are you feeling?"}
            </h3>
            <div className="relative w-full">
              <textarea 
                value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder={isInputLocked ? "Subscription required..." : "Describe your state..."}
                disabled={loading || isInputLocked}
                className={`w-full h-32 md:h-40 p-5 md:p-7 rounded-[2rem] text-base md:text-lg resize-none outline-none transition-all border ${isPremiumUI ? "bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-indigo-500/50" : "bg-background border-border text-foreground placeholder-muted focus:border-teal-500/50"} ${isInputLocked ? "opacity-30" : ""}`}
              />
              {isInputLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-[2px] rounded-[2rem]">
                   <Lock className="w-6 h-6 text-white" />
                   <p className="text-white font-black text-[10px] uppercase tracking-widest">Premium Access Required</p>
                </div>
              )}
            </div>
            <button 
              onClick={handleGenerate} 
              disabled={loading || (!prompt.trim() && !isInputLocked)}
              className={`w-full max-w-md mt-6 py-4 rounded-2xl font-bold text-sm md:text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.01] shadow-xl ${isInputLocked ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20" : isPremiumUI ? "bg-indigo-500 text-white shadow-indigo-500/40" : "bg-teal-600 text-white shadow-teal-500/20"}`}>
              {loading ? (
                <> <Loader2 className="w-5 h-5 animate-spin" /> {isPremiumUI ? "Listening..." : "Processing..."} </>
              ) : isInputLocked ? (
                <> <Crown className="w-5 h-5" /> Upgrade to UNLOCK </>
              ) : (
                <> <PlayCircle className="w-5 h-5" /> Generate Guide </>
              )}
            </button>
          </div>
      </div>
    </div>
  );
}
