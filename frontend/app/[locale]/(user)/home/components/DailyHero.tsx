"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function DailyHero() {
  const [day, setDay] = useState(1);

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
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <section className="px-6 py-4">
      {/* Soft gradient card mimicking Balance App's main Plan view */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] rounded-[2.5rem] overflow-hidden flex flex-col justify-end p-8 bg-gradient-to-tr from-indigo-900 via-sky-800 to-[#1b2f42] shadow-[0_20px_40px_-15px_rgba(30,58,138,0.5)] cursor-pointer group">
        
        {/* Abstract organic background overlay */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5?q=80&w=1200')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-white/80 font-medium text-sm tracking-widest uppercase mb-2">
            Day {day} of Journey
          </p>
          <h2 className="text-4xl text-white font-serif font-medium mb-8">
            Daily Flow
          </h2>
          
          <Link href="./breathe" className="w-16 h-16 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-300">
            <Play className="w-6 h-6 ml-1 fill-current" />
          </Link>
        </div>
      </div>
    </section>
  );
}
