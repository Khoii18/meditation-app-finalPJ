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
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/content`)
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
    <div className="w-full min-h-screen bg-[#f1f7f9] text-foreground overflow-x-hidden pb-28 md:pb-16 transition-colors duration-500">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-12 md:pt-16">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-800">Meditation Plans</h1>
        </header>
        
        {Object.entries(groupedPlans).map(([subject, subjectPlans], idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="mb-14"
          >
            <h2 className="text-[11px] font-black text-[#5c7a8a] uppercase tracking-[0.25em] mb-6 px-1">
              {subject}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectPlans.map((plan: any) => {
                const IconComp = (Icons as any)[plan.iconName] || Icons.Map;
                
                const isLocked = plan.unlockedByStreak && !claimedRewards.includes(plan.unlockedByStreak) && !isPaid;
                const linkHref = isLocked ? "#" : `./plans/${plan._id}`;

                return (
                  <Link href={linkHref} key={plan._id} className={`group ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <div className={`bg-white rounded-[2rem] overflow-hidden transition-all duration-500 ${!isLocked && "hover:shadow-2xl hover:shadow-teal-900/5 group-hover:-translate-y-2"} border border-slate-100 shadow-sm relative flex flex-col h-full`}>
                      
                      {isLocked && (
                        <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                          <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center mb-3">
                            <Icons.Lock className="w-6 h-6 text-slate-300" />
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bonus Content</p>
                        </div>
                      )}

                      <div className={`aspect-[1.2/1] relative p-10 flex flex-col items-center justify-center ${isLocked ? "opacity-30 grayscale" : ""}`}>
                        {/* Background subtle art */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#f8fbfe] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="absolute top-6 right-6 w-10 h-10 border border-teal-100 rounded-full opacity-40 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="absolute bottom-6 left-10 w-6 h-6 bg-teal-50 rounded-lg rotate-12 opacity-40 group-hover:rotate-45 transition-transform duration-700" />
                        
                        <IconComp 
                          className={`relative z-10 w-20 h-20 text-[#2dd4bf] opacity-80 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3`} 
                          strokeWidth={1.2} 
                        />
                      </div>
                      
                      <div className={`p-8 pt-0 text-center ${isLocked ? "opacity-30" : ""}`}>
                        <div className="w-full h-px bg-slate-50 mb-6" />
                        <h4 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-teal-600 transition-colors">
                          {plan.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
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
