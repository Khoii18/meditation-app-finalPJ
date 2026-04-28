"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Crown, Layers } from "lucide-react";
import { API_URL } from "@/config";

export function SinglesList() {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startScrollLeft = useRef(0);
  const isPaused = useRef(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/content`);
        if (res.ok) {
          const data = await res.json();
          setRoutines(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || routines.length === 0) return;

    const SCROLL_STEP = 170;

    const autoScroll = () => {
      if (isPaused.current || !el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: SCROLL_STEP, behavior: "smooth" });
      }
    };

    autoScrollRef.current = setInterval(autoScroll, 2000);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [routines]);

  const onMouseEnter = () => { isPaused.current = true; };
  const onMouseLeave = () => {
    isPaused.current = false;
    isDragging.current = false;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    hasMoved.current = false;
    isPaused.current = true;
    startX.current = e.pageX - el.offsetLeft;
    startY.current = e.pageY - el.offsetTop;
    startScrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    
    const x = e.pageX - el.offsetLeft;
    const y = e.pageY - el.offsetTop;
    const dist = Math.sqrt(Math.pow(x - startX.current, 2) + Math.pow(y - startY.current, 2));
    
    if (dist > 5) {
      hasMoved.current = true;
    }

    if (hasMoved.current) {
      e.preventDefault();
      const walk = (x - startX.current) * 1.2;
      el.scrollLeft = startScrollLeft.current - walk;
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;
    isPaused.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  if (loading) return (
    <section className="w-full">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-sm font-serif font-bold text-foreground uppercase tracking-widest opacity-60">Singles</h3>
      </div>
      <div className="flex gap-4 pb-4">
        {[1,2,3,4].map(i => <div key={i} className="min-w-[150px] h-44 rounded-2xl bg-surface animate-pulse border border-border" />)}
      </div>
    </section>
  );

  if (routines.length === 0) return (
    <section className="w-full">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-sm font-serif font-bold text-foreground uppercase tracking-widest opacity-60">Singles</h3>
      </div>
      <div className="rounded-2xl bg-surface border border-border p-8 text-center">
        <Layers className="w-8 h-8 text-muted mx-auto mb-2" />
        <p className="text-sm text-muted">No content yet. Admin can add meditation content from the dashboard.</p>
      </div>
    </section>
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xs font-serif font-bold text-foreground uppercase tracking-[0.2em] opacity-80">Singles</h3>
        <button className="px-3 py-1 rounded-full bg-teal-50 dark:bg-white/5 text-[10px] text-teal-600 dark:text-teal-400 font-black uppercase tracking-widest hover:bg-teal-100 transition-all border border-teal-100/50">View All</button>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          cursor: "grab",
          overflow: "hidden",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        className="flex gap-4 pb-2 select-none"
      >
        {routines.map((routine, idx) => (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(idx * 0.07, 0.4) }}
            key={routine._id}
            className="min-w-[150px] max-w-[150px] flex-shrink-0"
          >
            <Link
              href={`./play/${routine._id}`}
              className="group flex flex-col gap-2"
              draggable={false}
              onClick={(e) => {
                if (hasMoved.current) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <div className="relative rounded-2xl overflow-hidden bg-surface shadow-sm transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(13,148,136,0.2)] group-hover:-translate-y-1 border border-border">
                <div className="aspect-square">
                  <img
                    src={routine.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400'}
                    alt={routine.title}
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {routine.isPremium && (
                  <span className="absolute top-2 right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-amber-900" />
                  </span>
                )}
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                  <Play className="w-3.5 h-3.5 fill-teal-600 text-teal-600 ml-0.5" />
                </div>
              </div>
              <div className="px-0.5 mt-1">
                <p className="text-[9px] uppercase font-black tracking-widest text-teal-500/80 mb-1">{routine.type || 'Session'}</p>
                <h4 className="text-[13px] font-bold text-foreground leading-tight line-clamp-1 mb-1">{routine.title}</h4>
                <div className="flex items-center gap-1.5 opacity-60">
                  <div className="w-1 h-1 rounded-full bg-muted" />
                  <p className="text-[10px] font-medium">{routine.duration || '10 min'}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
