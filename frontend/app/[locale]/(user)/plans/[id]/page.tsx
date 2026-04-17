"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, PlayCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PlanDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const localUser = localStorage.getItem("user");
      if (localUser) setUser(JSON.parse(localUser));
    } catch (e) {}

    fetch(`http://localhost:5000/api/content/${id}`)
      .then(res => res.json())
      .then(data => {
        setPlan(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center">
        <p>Plan not found.</p>
      </div>
    );
  }

  // Parse days from duration (e.g. "Plan • 10 Days" -> 10)
  // If it's a single track masquerading as a plan, we default to 7 days
  const match = plan.duration?.match(/(\d+)/);
  const numDays = match ? parseInt(match[1]) : 7;
  
  const daysArray = Array.from({ length: numDays }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Header section with gradient and back button */}
      <div className="relative pt-24 pb-16 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-indigo-900/30 to-[#0A0A0C] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10 w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Plans</span>
          </button>

          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-semibold tracking-wide uppercase mb-4">
              {plan.subject || "Process Plan"}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              {plan.title}
            </h1>
            <p className="text-xl text-slate-300 font-light">
              Welcome to your relaxation, {user?.name ? user.name.split(" ")[0] : "Friend"}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 pb-32">
        <div className="bg-[#1C1C1E] rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          
          <h2 className="text-2xl font-bold font-serif mb-8 text-white">Your {numDays}-Day Journey</h2>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.15rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            
            {daysArray.map((day, idx) => {
              // Simulate progress: first day completed, second day active
              const isCompleted = day === 1;
              const isActive = day === 2;
              const isLocked = day > 2;

              return (
                <div key={day} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  
                  {/* Timeline Badge */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#1C1C1E] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
                    isCompleted ? 'bg-indigo-500 text-white' : isActive ? 'bg-white text-indigo-600 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bold text-sm">{day}</span>}
                  </div>

                  {/* Content Card */}
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border transition-all ${
                    isActive ? 'bg-indigo-500/10 border-indigo-500/50 scale-[1.02]' : isLocked ? 'bg-black/20 border-white/5 opacity-50' : 'bg-slate-800/50 border-white/10 hover:bg-slate-800'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-bold ${isActive ? 'text-indigo-300' : 'text-slate-200'}`}>
                        Day {day}: {plan.title}
                      </h4>
                      {isCompleted && <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">Done</span>}
                    </div>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                       Follow along with this deeply restorative {Math.max(5, Math.floor(Math.random() * 15))} minute session specifically curated for your daily process.
                    </p>
                    
                    {!isLocked && (
                      <Link href={`./../play/${plan._id}`} className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                        isActive ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}>
                        <PlayCircle className="w-4 h-4" />
                        {isCompleted ? 'Listen Again' : 'Start Session'}
                      </Link>
                    )}
                    {isLocked && (
                      <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4 rotate-180 opacity-50" />
                        Complete previous day
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}
