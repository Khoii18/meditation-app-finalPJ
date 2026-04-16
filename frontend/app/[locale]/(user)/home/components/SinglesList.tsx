"use client";

import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export function SinglesList() {
  const [routines, setRoutines] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const FALLBACK_DATA = [
    { _id: "s1", title: "Deep Rest", type: "Single", duration: "15 min", image: "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?q=80&w=600" },
    { _id: "s2", title: "Morning Stretch", type: "Single", duration: "10 min", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600" },
    { _id: "s3", title: "Focus Flow", type: "Work", duration: "20 min", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5?q=80&w=600" },
    { _id: "s4", title: "Evening Wind Down", type: "Single", duration: "10 min", image: "https://images.unsplash.com/photo-1499209974431-9dddcece7fdd?q=80&w=600" },
    { _id: "s5", title: "Quick Relief", type: "Anxiety", duration: "5 min", image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=600" }
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/content");
        if (res.ok) {
          const data = await res.json();
          setRoutines(data.length > 0 ? data : FALLBACK_DATA);
        } else {
          setRoutines(FALLBACK_DATA);
        }
      } catch (err) {
        setRoutines(FALLBACK_DATA);
      }
    };
    fetchContent();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
    }
  };

  if (routines.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-6 mb-6"
    >
      <div className="px-6 mb-4 flex justify-between items-center whitespace-nowrap">
        <h3 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100 flex-shrink-0">Singles</h3>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button 
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-white/10 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-white" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-white/10 transition-colors group"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-white" />
            </button>
          </div>
          <button className="text-sm text-indigo-500 font-medium hover:underline flex-shrink-0">View All</button>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-4 px-6 overflow-x-auto pb-4 snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {routines.map((routine, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(idx * 0.1, 0.5) }} // limit delay so it doesn't take too long for off-screen items
              key={routine._id} 
              className="min-w-[160px] max-w-[160px] snap-start"
            >
              <Link href={`./play/${routine._id}`} className="group flex flex-col gap-3">
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm transition-transform group-hover:-translate-y-2 group-hover:shadow-xl">
                  <img 
                    src={routine.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400'} 
                    alt={routine.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                  <button className="absolute bottom-3 right-3 w-8 h-8 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </button>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">{routine.type || 'Meditation'}</p>
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight mb-1">{routine.title}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">{routine.duration || '10 min'}</p>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
