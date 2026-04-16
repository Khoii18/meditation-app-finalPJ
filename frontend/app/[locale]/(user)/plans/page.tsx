"use client";

import { motion } from "framer-motion";
import { 
  Sunrise, Coffee, Heart, Mic, CloudLightning, Activity,
  Leaf, CloudMoon, CloudRain, SunMedium, UserCheck, CheckCircle,
  HelpCircle, Home, Smile, Zap, RotateCcw, Monitor, Layers, 
  Map, Target, AlignStartVertical, TrendingUp, Sparkles
} from "lucide-react";
import Link from "next/link";

const PLAN_CATEGORIES = [
  {
    title: "Morning Meditations",
    items: [
      { id: "p1", title: "Wake Up", subtitle: "Single • 3 min", icon: Sunrise, bg: "from-slate-700 to-slate-800", iconColor: "text-sky-400" },
      { id: "p2", title: "Morning Brew", subtitle: "Single • 5 min", icon: Coffee, bg: "from-slate-700 to-slate-800", iconColor: "text-indigo-400" },
      { id: "p3", title: "Gratitude", subtitle: "Single • 5 min", icon: Heart, bg: "from-slate-700 to-slate-800", iconColor: "text-emerald-400" },
    ]
  },
  {
    title: "Release Tension",
    items: [
      { id: "p4", title: "Sound Scan", subtitle: "Single • 5 min", icon: Mic, bg: "from-slate-700 to-slate-800", iconColor: "text-amber-400" },
      { id: "p5", title: "Frustration", subtitle: "Single • 10 min", icon: CloudLightning, bg: "from-slate-700 to-slate-800", iconColor: "text-rose-400" },
      { id: "p6", title: "Body Scan", subtitle: "Single • 5 min", icon: Activity, bg: "from-slate-700 to-slate-800", iconColor: "text-teal-400" },
    ]
  },
  {
    title: "For Later",
    items: [
      { id: "p7", title: "Immersive Forest", subtitle: "Sleep Single • 10 min", icon: Leaf, bg: "from-slate-700 to-slate-800", iconColor: "text-emerald-500" },
      { id: "p8", title: "Dream Scenes", subtitle: "Sleep Single • 20 min", icon: CloudMoon, bg: "from-slate-700 to-slate-800", iconColor: "text-rose-300" },
      { id: "p9", title: "Rain", subtitle: "Sleep Sound", icon: CloudRain, bg: "from-slate-700 to-slate-800", iconColor: "text-blue-400" },
    ]
  },
  {
    title: "Get Support",
    items: [
      { id: "p10", title: "Confidence", subtitle: "Single • 10 min", icon: SunMedium, bg: "from-slate-700 to-slate-800", iconColor: "text-amber-300" },
      { id: "p11", title: "Ease Loneliness", subtitle: "Single • 10 min", icon: UserCheck, bg: "from-slate-700 to-slate-800", iconColor: "text-orange-300" },
      { id: "p12", title: "Facing Fear", subtitle: "Single • 15 min", icon: CheckCircle, bg: "from-slate-700 to-slate-800", iconColor: "text-violet-400" },
      { id: "p13", title: "Pain", subtitle: "Single • 10 min", icon: HelpCircle, bg: "from-slate-700 to-slate-800", iconColor: "text-rose-400" },
      { id: "p14", title: "Parent", subtitle: "Plan • 5 Days", icon: Home, bg: "from-slate-700 to-slate-800", iconColor: "text-teal-500" },
    ]
  },
  {
    title: "Lift Your Mood",
    items: [
      { id: "p15", title: "Happiness", subtitle: "Single • 10 min", icon: Smile, bg: "from-slate-700 to-slate-800", iconColor: "text-rose-300" },
      { id: "p16", title: "Embrace Change", subtitle: "Single • 10 min", icon: RotateCcw, bg: "from-slate-700 to-slate-800", iconColor: "text-emerald-400" },
      { id: "p17", title: "Energy", subtitle: "Single • 10 min", icon: Zap, bg: "from-slate-700 to-slate-800", iconColor: "text-amber-400" },
    ]
  },
  {
    title: "Learn to Meditate",
    items: [
      { id: "p18", title: "Foundations", subtitle: "Plan • 10 Days", icon: Monitor, bg: "from-slate-700 to-slate-800", iconColor: "text-violet-500" },
      { id: "p19", title: "Foundations II", subtitle: "Plan • 10 Days", icon: Layers, bg: "from-slate-700 to-slate-800", iconColor: "text-teal-400" },
      { id: "p20", title: "Foundations V", subtitle: "Plan • 10 Days", icon: Map, bg: "from-slate-700 to-slate-800", iconColor: "text-rose-400" },
    ]
  },
  {
    title: "Advance Your Practice",
    items: [
      { id: "p21", title: "Advanced", subtitle: "Plan • 10 Days", icon: Target, bg: "from-slate-700 to-slate-800", iconColor: "text-amber-500" },
      { id: "p22", title: "Advanced II", subtitle: "Plan • 10 Days", icon: AlignStartVertical, bg: "from-slate-700 to-slate-800", iconColor: "text-emerald-500" },
      { id: "p23", title: "Advanced III", subtitle: "Plan • 10 Days", icon: TrendingUp, bg: "from-slate-700 to-slate-800", iconColor: "text-sky-400" },
      { id: "p24", title: "Advanced IV", subtitle: "Plan • 10 Days", icon: Activity, bg: "from-slate-700 to-slate-800", iconColor: "text-indigo-400" },
    ]
  }
];

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

  return (
    <div className="w-full min-h-screen bg-[#0A0A0C] text-white overflow-x-hidden pb-32">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-10">
        
        {/* Render Admin Dynamically Added Plans */}
        {adminPlans.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h2 className="text-[15px] font-semibold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Featured Plans
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {adminPlans.map((plan) => (
                <Link href={`./play/${plan._id}`} key={plan._id} className="group cursor-pointer">
                  <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_-15px_rgba(79,70,229,0.5)] border border-indigo-500/20">
                    <div className="aspect-square relative flex flex-col items-center justify-center bg-indigo-900/20 overflow-hidden">
                      {plan.image ? (
                        <img src={plan.image} alt={plan.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <Map className="w-16 h-16 text-indigo-400 opacity-80 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] to-transparent opacity-80" />
                    </div>
                    
                    <div className="p-4 relative z-10 -mt-8">
                      <h4 className="font-semibold text-slate-100 text-[15px] mb-1 group-hover:text-indigo-400 transition-colors">
                        {plan.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium tracking-wide">
                        {plan.type} • {plan.duration}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {PLAN_CATEGORIES.map((category, catIdx) => (
          <motion.div 
            key={catIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.1 }}
            className="mb-10"
          >
            <h2 className="text-[15px] font-semibold text-slate-300 uppercase tracking-widest mb-4">
              {category.title}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.items.map((item) => (
                <Link href={`./play/${item.id}`} key={item.id} className="group cursor-pointer">
                  <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]">
                    <div className="aspect-square relative p-6 bg-slate-800 overflow-hidden flex flex-col justify-end">
                      {/* Decorative background shapes */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full translate-y-1/3 -translate-x-1/4" />
                      
                      {/* Big Icon mimicking the illustration */}
                      <item.icon className={`absolute inset-0 m-auto w-16 h-16 ${item.iconColor} opacity-90 transition-transform duration-500 group-hover:scale-110`} strokeWidth={1.5} />
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-100 text-[15px] mb-1 group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium tracking-wide">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
