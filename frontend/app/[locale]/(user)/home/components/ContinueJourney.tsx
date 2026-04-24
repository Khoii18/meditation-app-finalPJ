"use client";

import { useState, useEffect } from "react";
import { Play, Loader2, Sparkles, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function ContinueJourney() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivePlan = async () => {
      if (!user?.activePlan) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/content/${user.activePlan}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setActivePlan(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivePlan();
  }, [user, token]);

  if (loading) {
    return (
      <div className="bg-surface rounded-[2rem] p-6 border border-border shadow-sm flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted" />
      </div>
    );
  }

  if (!activePlan) return null;

  const progress = user?.planProgress || 0;
  const locale = window.location.pathname.split('/')[1] || 'vi';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-[2.5rem] p-6 border border-border shadow-sm group hover:border-teal-500/30 transition-all cursor-pointer relative overflow-hidden"
      onClick={() => router.push(`/${locale}/play?id=${activePlan._id}`)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-teal-500/10 transition-colors" />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">Continue Journey</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted group-hover:text-teal-600 group-hover:translate-x-1 transition-all">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10">
        <h4 className="text-xl font-serif font-bold text-foreground mb-1">{activePlan.title}</h4>
        <div className="flex items-center gap-3 text-xs text-muted mb-6">
           <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Day {progress + 1} of 10</span>
           <span className="w-1 h-1 rounded-full bg-border" />
           <span className="capitalize">{activePlan.type}</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-muted uppercase tracking-tighter">
             <span>Progress</span>
             <span>{Math.round((progress / 10) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${(progress / 10) * 100}%` }}
               className="h-full bg-teal-500 rounded-full"
             />
          </div>
        </div>

        <button className="w-full mt-6 py-3 bg-teal-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all">
           <Play className="w-4 h-4 fill-current" />
           Resume Session
        </button>
      </div>
    </motion.div>
  );
}
