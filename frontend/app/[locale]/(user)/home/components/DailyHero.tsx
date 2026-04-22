"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function DailyHero() {
  const [day, setDay] = useState(1);
  const [planName, setPlanName] = useState("Foundations Plan");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDay((data.stats?.currentStreak || 0) + 1);
        }
      } catch (err) { console.error(err); }
    };
    fetchUser();
  }, []);

  return (
    <section className="w-full">
      {/* Balance-style hero card — image + teal overlay */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full rounded-3xl overflow-hidden cursor-pointer group bg-[#E6F7F5] border border-teal-100/60 shadow-sm"
        style={{ aspectRatio: "16/7" }}
      >
        {/* Subtle decorative pattern / shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-10 w-32 h-32 bg-white/60 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-teal-600 mb-2">
              Day {day} of 10
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-slate-800">{planName}</h2>
          </div>

          <Link
            href="./breathe"
            className="flex items-center gap-3 self-start"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300">
              <Play className="w-5 h-5 ml-0.5 fill-teal-600 text-teal-600" />
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">Start Session</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
