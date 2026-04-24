"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Heart, Clock, User, Play, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PlanDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/content/${id}`)
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
      <div className="min-h-screen bg-[#364147] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#364147] text-white flex items-center justify-center">
        <p>Plan not found.</p>
      </div>
    );
  }

  const hasLessons = plan.lessons && plan.lessons.length > 0;
  const numDays = hasLessons ? plan.lessons.length : (plan.duration?.match(/(\d+)/)?.[1] ? parseInt(plan.duration.match(/(\d+)/)[1]) : 7);
  const daysArray = Array.from({ length: numDays }, (_, i) => i);

  // Determine the first active day. In a real app, this would be based on user progress.
  // We'll set it to Day 1 (index 0) for now.
  const activeIndex = 0; 

  return (
    <div className="min-h-screen bg-[#364147] text-slate-100 font-sans pb-32">
      
      {/* Header section */}
      <div className="flex justify-between items-center px-6 py-6 pt-12">
        <button onClick={() => router.back()} className="text-white/80 hover:text-white transition-colors">
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <button className="text-white/80 hover:text-white transition-colors">
          <Heart className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>

      {/* Graphic Placeholder (Can be dynamic based on plan.image) */}
      <div className="flex justify-center mb-8 px-6">
        {plan.image ? (
           <img src={plan.image} alt={plan.title} className="w-32 h-32 object-cover rounded-full border-4 border-white/10" />
        ) : (
           <div className="w-32 h-32 bg-[#F2D780] rounded-full border-4 border-white/10" />
        )}
      </div>

      <div className="text-center px-8 mb-8">
        <h1 className="text-3xl font-semibold text-white mb-4 tracking-wide">
          {plan.title}
        </h1>
        <p className="text-white/70 text-[15px] leading-relaxed font-light">
          {plan.description || "Explore science-backed strategies to help you relax in this Plan."}
        </p>
      </div>

      {/* Info Row: Duration & Instructor */}
      <div className="flex justify-center gap-12 mb-10 px-6">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-[#F2E5D0] text-[#364147] rounded-full flex items-center justify-center mb-3">
            <Clock className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <span className="text-xs font-medium text-white/80">{plan.duration || "10 min"}<span className="ml-1 opacity-50">v</span></span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-slate-200 text-[#364147] rounded-full flex items-center justify-center mb-3 overflow-hidden">
            <User className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <span className="text-xs font-medium text-white/80">{plan.instructor || "Ofosu"}<span className="ml-1 opacity-50">v</span></span>
        </div>
      </div>

      {/* List of Days */}
      <div className="px-6 max-w-2xl mx-auto">
        {daysArray.map((idx) => {
          const day = idx + 1;
          const lesson = hasLessons ? plan.lessons[idx] : null;
          const isCurrent = idx === activeIndex;
          
          return (
            <Link href={`./../play/${plan._id}?lessonIndex=${idx}`} key={day} className="flex items-center py-5 border-b border-white/10 last:border-0 group cursor-pointer transition-colors hover:bg-white/5">
              <div className="mr-5 flex-shrink-0">
                {isCurrent ? (
                  <div className="w-8 h-8 rounded-full bg-[#30D5C8] flex items-center justify-center text-white shadow-[0_0_15px_rgba(48,213,200,0.3)]">
                    <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={0} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:bg-white/20 transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={0} />
                  </div>
                )}
              </div>
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1 font-semibold">DAY {day}</div>
                <div className={`text-[15px] ${isCurrent ? 'text-white' : 'text-white/60'} font-medium`}>
                  {lesson?.title || `Session ${day}`}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#364147] via-[#364147] to-transparent pt-12 z-50 max-w-md mx-auto">
        <Link href={`./../play/${plan._id}?lessonIndex=${activeIndex}`} className="block w-full bg-[#30D5C8] hover:bg-[#2bc2b6] text-white text-center font-bold py-4 rounded-lg transition-colors shadow-lg">
          Begin Day {activeIndex + 1}
        </Link>
      </div>

    </div>
  );
}
