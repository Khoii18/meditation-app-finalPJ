"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

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

  if (routines.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-sm font-serif font-bold text-foreground uppercase tracking-widest opacity-60">Singles</h3>
        <button className="text-[10px] text-teal-600 dark:text-teal-400 font-bold hover:text-teal-700 transition-colors">View All</button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {routines.map((routine, idx) => (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(idx * 0.07, 0.4) }}
            key={routine._id}
            className="min-w-[150px] max-w-[150px] snap-start flex-shrink-0"
          >
            <Link href={`./play/${routine._id}`} className="group flex flex-col gap-2">
              <div className="relative rounded-2xl overflow-hidden bg-surface shadow-sm transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(13,148,136,0.2)] group-hover:-translate-y-1 border border-border">
                <div className="aspect-square">
                  <img
                    src={routine.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400'}
                    alt={routine.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Premium badge */}
                {routine.isPremium && (
                  <span className="absolute top-2 right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-amber-900" />
                  </span>
                )}
                {/* Play button */}
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                  <Play className="w-3.5 h-3.5 fill-teal-600 text-teal-600 ml-0.5" />
                </div>
              </div>
              <div className="px-0.5">
                <p className="text-[10px] uppercase font-bold tracking-wider text-teal-500 mb-0.5">{routine.type || 'Session'}</p>
                <h4 className="text-xs font-semibold text-foreground opacity-90 leading-snug">{routine.title}</h4>
                <p className="text-[11px] text-muted mt-0.5">{routine.duration || '10 min'}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
