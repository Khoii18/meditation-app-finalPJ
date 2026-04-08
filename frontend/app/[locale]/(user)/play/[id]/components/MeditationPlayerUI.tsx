"use client";

import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface MeditationPlayerUIProps {
  id: string;
}

export function MeditationPlayerUI({ id }: MeditationPlayerUIProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const totalTime = 600; // 10 minutes (600 seconds)

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < totalTime) {
      interval = setInterval(() => {
        setProgress(p => p + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercentage = (progress / totalTime) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Background Ambient Video/Image */}
      <div 
        className="absolute inset-0 z-0 opacity-60 mix-blend-screen scale-105"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: "blur(20px) saturate(1.5)"
        }}
      />
      
      {/* Top Bar */}
      <div className="relative z-[1000] flex justify-between items-center px-6 py-6 pt-12 cursor-pointer z-50">
        <button 
          onClick={() => window.history.back()} 
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors cursor-pointer z-50"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex gap-4">
          <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 mt-[-10vh]">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-white/60 tracking-[0.2em] text-xs uppercase font-bold mb-3 block">Foundation Focus {id !== "daily" ? `(${id})` : ""}</span>
          <h1 className="text-4xl md:text-5xl font-serif mb-2">Deep Breathing</h1>
          <p className="text-white/70">Master Roy • Series 1</p>
        </motion.div>

        {/* Circular Timer UI */}
        <div className="relative flex items-center justify-center mb-16">
          {/* SVG Circle indicator */}
          <svg className="w-[300px] h-[300px] transform -rotate-90">
            <circle cx="150" cy="150" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
            <circle 
              cx="150" cy="150" r={radius} 
              stroke="white" strokeWidth="4" fill="none" 
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
              className="transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-medium font-serif">{formatTime(progress)}</span>
            <span className="text-white/50 text-sm mt-1">/ {formatTime(totalTime)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-10">
          <button 
            onClick={() => setProgress(Math.max(0, progress - 15))}
            className="text-white/60 hover:text-white transition-colors"
          >
            <SkipBack className="w-8 h-8" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>

          <button 
            onClick={() => setProgress(Math.min(totalTime, progress + 15))}
            className="text-white/60 hover:text-white transition-colors"
          >
            <SkipForward className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
