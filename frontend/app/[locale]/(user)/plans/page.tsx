"use client";

import { motion } from "framer-motion";
import { 
  Sunrise, Coffee, Heart, Mic, CloudLightning, Activity,
  Leaf, CloudMoon, CloudRain, SunMedium, UserCheck, CheckCircle,
  HelpCircle, Home, Smile, Zap, RotateCcw, Monitor, Layers, 
  Map, Target, AlignStartVertical, TrendingUp, Sparkles
} from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PlansPage() {
  const [adminPlans, setAdminPlans] = useState<any[]>([]);

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

  // Dynamically group plans based on their "subject"
  const groupedPlans = adminPlans.reduce((groups, plan) => {
    const subj = plan.subject || "Featured Plans";
    if (!groups[subj]) groups[subj] = [];
    groups[subj].push(plan);
    return groups;
  }, {} as Record<string, any[]>);

  return (
    <div className="w-full min-h-screen bg-[#0A0A0C] text-white overflow-x-hidden pb-32">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-10">
        
        {Object.entries(groupedPlans).map(([subject, subjectPlans], idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="mb-10"
          >
            <h2 className="text-[15px] font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              {subject === "Featured Plans" ? <Icons.Sparkles className="w-4 h-4 text-indigo-400"/> : null} 
              <span className={subject === "Featured Plans" ? "text-indigo-400" : ""}>{subject}</span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjectPlans.map((plan: any) => {
                const IconComp = (Icons as any)[plan.iconName] || Icons.Map;
                return (
                  <Link href={`./plans/${plan._id}`} key={plan._id} className="group cursor-pointer">
                    <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_-15px_rgba(79,70,229,0.5)] border border-indigo-500/20">
                      <div className="aspect-square relative p-6 bg-slate-800 overflow-hidden flex flex-col justify-end">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full translate-y-1/3 -translate-x-1/4" />
                        
                        <IconComp className={`absolute inset-0 m-auto w-16 h-16 ${plan.iconColor || 'text-white/50'} opacity-90 transition-transform duration-500 group-hover:scale-110`} strokeWidth={1.5} />
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-slate-100 text-[15px] mb-1 group-hover:text-indigo-400 transition-colors">
                          {plan.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium tracking-wide">
                          {plan.duration}
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
