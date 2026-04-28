"use client";

import { Headphones, ChevronLeft, ChevronRight, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { API_URL } from "@/config";

export function SleepStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/content`);
        if (res.ok) {
          const data = await res.json();
          const sleepData = data.filter((d: any) =>
            d.type?.toLowerCase().includes("sleep") ||
            d.type?.toLowerCase().includes("story") ||
            d.title?.toLowerCase().includes("sleep")
          );
          setStories(sleepData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) return (
    <section>
      <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-500 mb-6 flex items-center gap-2">
        <Headphones className="w-4 h-4 text-teal-400" /> Sleep Stories
      </h2>
      <div className="flex gap-6">
        {[1,2].map(i => <div key={i} className="min-w-[85vw] md:min-w-[400px] h-56 rounded-[2.5rem] bg-white/5 animate-pulse" />)}
      </div>
    </section>
  );

  if (stories.length === 0) return (
    <section>
      <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-500 mb-6 flex items-center gap-2">
        <Headphones className="w-4 h-4 text-teal-400" /> Sleep Stories
      </h2>
      <div className="rounded-3xl bg-white/5 border border-white/10 p-10 text-center">
        <Moon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 text-sm">No sleep stories yet. Admin can add them from the dashboard.</p>
      </div>
    </section>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-500 flex items-center gap-2">
          <Headphones className="w-4 h-4 text-teal-400" /> Sleep Stories
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={scrollLeft} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group">
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </button>
          <button onClick={scrollRight} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group">
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {stories.map((story, i) => (
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              key={story._id || i}
              className="min-w-[85vw] md:min-w-[400px] snap-start group cursor-pointer relative rounded-[2.5rem] overflow-hidden aspect-[16/9] bg-indigo-900/50 shadow-lg shadow-black/20"
            >
              <Link href={`./play/${story._id}`}>
                <img
                  src={story.image || "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?q=80&w=600"}
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111115]/90 via-[#111115]/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-8">
                  <span className="bg-[#1C2028] text-teal-400 border border-[#252A36] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded inline-block shadow-sm">
                    {story.type}
                  </span>
                  <h3 className="text-2xl font-serif text-white mb-1 group-hover:text-teal-300 transition-colors mt-3">{story.title}</h3>
                  <p className="text-slate-400 text-sm font-medium">{story.duration}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
