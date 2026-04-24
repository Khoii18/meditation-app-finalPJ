"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

function PlansContent() {
  const [adminPlans, setAdminPlans] = useState<any[]>([]);
  const { claimedRewards, isPaid } = useAuth();

  useEffect(() => {
    fetch("http://localhost:5000/api/content")
      .then(res => res.json())
      .then(data => {
         if (Array.isArray(data)) {
           const plans = data.filter((d: any) => d.type?.toLowerCase().includes("plan"));
           setAdminPlans(plans);
         }
      })
      .catch(console.error);
  }, []);

  const groupedPlans: Record<string, any[]> = adminPlans.reduce((groups: Record<string, any[]>, plan: any) => {
    const subj = plan.subject || "Featured Plans";
    if (!groups[subj]) groups[subj] = [];
    groups[subj].push(plan);
    return groups;
  }, {});


  return (
    <div className="w-full min-h-screen bg-background text-foreground overflow-x-hidden pb-28 md:pb-16 transition-colors duration-500">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-8 md:pt-10">
        <header className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-500 mb-1">Your Programs</p>
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground">Meditation Plans</h1>
        </header>
        
        {Object.entries(groupedPlans).map(([subject, subjectPlans], idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="mb-10"
          >
            <h2 className="text-sm font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              {subject === "Featured Plans" ? <Icons.Sparkles className="w-4 h-4 text-teal-500"/> : null} 
              <span className={subject === "Featured Plans" ? "text-teal-600 dark:text-teal-400" : ""}>{subject}</span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {subjectPlans.map((plan: any) => {
                const IconComp = (Icons as any)[plan.iconName] || Icons.Map;
                
                const isLocked = plan.unlockedByStreak && !claimedRewards.includes(plan.unlockedByStreak) && !isPaid;
                const linkHref = isLocked ? "#" : `./plans/${plan._id}`;

                return (
                  <Link href={linkHref} key={plan._id} className={`group ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <div className={`bg-surface rounded-2xl overflow-hidden transition-all duration-300 ${!isLocked && "group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(13,148,136,0.15)]"} border border-border shadow-sm relative`}>
                      
                      {isLocked && (
                        <div className="absolute inset-0 z-20 bg-background/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                          <div className="w-10 h-10 rounded-full bg-surface shadow-md flex items-center justify-center mb-2">
                            <Icons.Lock className="w-5 h-5 text-muted" />
                          </div>
                          <p className="text-[10px] font-bold text-foreground uppercase tracking-widest opacity-80">Rewards Only</p>
                          <p className="text-[9px] text-muted font-medium">Claim in Streaks</p>
                        </div>
                      )}

                      <div className={`aspect-square relative p-6 bg-surface overflow-hidden flex flex-col items-center justify-center border-b border-border ${isLocked ? "opacity-30 grayscale" : ""}`}>
                        {/* Soft geometric shapes in background to mimic Balance's illustrations */}
                        <div className="absolute top-4 right-4 w-12 h-12 border-2 border-border rounded-full opacity-50" />
                        <div className="absolute bottom-6 left-6 w-8 h-8 bg-background rounded-lg rotate-45 opacity-50" />
                        
                        <IconComp className={`relative z-10 w-16 h-16 text-teal-600 dark:text-teal-400 opacity-90 transition-transform duration-500 ${!isLocked && "group-hover:scale-110"}`} strokeWidth={1} />
                      </div>
                      
                      <div className={`p-4 bg-surface text-center ${isLocked ? "opacity-30" : ""}`}>
                        <h4 className="font-semibold text-foreground text-[15px] mb-0.5 transition-colors">
                          {plan.title}
                        </h4>
                        <p className="text-xs text-muted font-medium tracking-wide">
                          {plan.unlockedByStreak ? "Bonus Content" : (plan.duration || "10 Days")}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function PlansPage() {
  return (
    <ProtectedRoute>
      <PlansContent />
    </ProtectedRoute>
  );
}
