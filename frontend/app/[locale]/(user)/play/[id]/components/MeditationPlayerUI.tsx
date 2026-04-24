"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Heart, Lock, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface MeditationPlayerUIProps {
  id: string;
}

export function MeditationPlayerUI({ id }: MeditationPlayerUIProps) {
  const [isPlaying, setIsPlaying] = useState(false); // Can change to true if we want strict auto-play
  const [progress, setProgress] = useState(0);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { isPaid, isLoading: authLoading } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Block access to premium content if user is not paid
  const isPremiumBlocked = !authLoading && content?.isPremium && !isPaid;

  useEffect(() => {
    console.log("DEBUG PLAYER:", { contentTitle: content?.title, isPremium: content?.isPremium, isPaid, authLoading, isPremiumBlocked });
  }, [content, isPaid, authLoading, isPremiumBlocked]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          // Suppress the console.error to avoid Next.js dev overlay popping up
          // console.warn("Audio playback issue (likely missing or invalid source):", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setProgress(newTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setProgress(audio.currentTime);
    audio.addEventListener("timeupdate", updateTime);
    return () => audio.removeEventListener("timeupdate", updateTime);
  }, [content]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (id === "daily") {
          setContent({ title: "Deep Breathing", instructor: "Master Roy", duration: "10 min", isPremium: false, type: "Daily" });
          setLoading(false);
          return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/content/${id}`);
        if (res.ok) {
          const data = await res.json();
          // Check for lesson index in URL
          const urlParams = new URLSearchParams(window.location.search);
          const lessonIndex = urlParams.get('lessonIndex');
          if (lessonIndex !== null && data.lessons && data.lessons[parseInt(lessonIndex)]) {
            const lesson = data.lessons[parseInt(lessonIndex)];
            setContent({
              ...data,
              title: lesson.title || `Day ${parseInt(lessonIndex) + 1}`,
              description: lesson.description || data.description,
              duration: lesson.duration || data.duration,
              audioUrl: lesson.audioUrl || data.audioUrl,
              type: "Plan Lesson"
            });
          } else {
            setContent(data);
          }
        } else {
          setContent({ title: "Mindful Session", instructor: "Oasis", duration: "10 min", isPremium: false, type: "Meditation" });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  const totalTime = audioRef.current?.duration && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0
    ? audioRef.current.duration
    : (content?.duration ? parseInt(content.duration.split(" ")[0]) * 60 : 600);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isSleep = content?.type?.toLowerCase().includes("sleep") || content?.type?.toLowerCase().includes("nap");
  // Day mode uses teal, night mode uses darker colors
  const primaryColor = isSleep ? "#14B8A6" : "#2DD4BF"; // Light teal
  const bgColor = isSleep ? "#111115" : "#1c222b";
  
  if (loading || authLoading) {
    return <div className="fixed inset-0 z-[100] bg-[#1c222b] flex items-center justify-center text-white/50 text-sm tracking-widest uppercase">Loading...</div>;
  }

  const progressPercentage = totalTime > 0 ? (progress / totalTime) * 100 : 0;
  
  // Provide a reliable fallback audio URL if it's missing or empty
  const audioSrc = (content?.audioUrl && content.audioUrl.trim() !== "") 
    ? content.audioUrl 
    : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col font-sans overflow-hidden transition-colors duration-1000`} style={{ backgroundColor: bgColor }}>
      
      <audio ref={audioRef} src={audioSrc} preload="auto" onEnded={() => setIsPlaying(false)} />

      {/* Top Bar */}
      <div className="relative z-20 flex justify-between items-start px-8 py-10">
        <button
          onClick={() => window.history.back()}
          className="text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>
        
        <div className="flex flex-col items-center mt-1">
          <h1 className="text-white font-serif text-[1.35rem] font-medium tracking-wide mb-1.5">{content?.title}</h1>
          <span className="text-white/40 text-[9px] tracking-[0.25em] uppercase font-bold">{content?.type?.toUpperCase() || "PLAN LESSON"}</span>
        </div>

        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`${isLiked ? 'text-rose-400' : 'text-white/50 hover:text-white'} transition-colors`}
        >
          <Heart className="w-6 h-6" strokeWidth={1.5} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>

       {/* Main Animation Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-6 overflow-hidden">
         <div className="relative flex items-center justify-center w-64 h-64">
           {/* Outer Ring */}
           <motion.div 
             className="absolute w-56 h-56 rounded-full border border-white/5"
             animate={isPlaying && !isPremiumBlocked ? { scale: [1, 1.1, 1] } : { scale: 1 }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           />
           {/* Inner Ring */}
           <motion.div 
             className="absolute w-40 h-40 rounded-full border border-white/5"
             animate={isPlaying && !isPremiumBlocked ? { scale: [1, 1.15, 1] } : { scale: 1 }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           />
           {/* Glowing Aura */}
           <motion.div 
             className="absolute w-28 h-28 rounded-full blur-2xl"
             style={{ backgroundColor: primaryColor, opacity: 0.2 }}
             animate={isPlaying && !isPremiumBlocked ? { scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] } : { scale: 1 }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           />
           {/* Solid Center Circle */}
           <motion.div 
             className={`absolute w-[3.25rem] h-[3.25rem] rounded-full shadow-[0_0_20px_rgba(45,212,191,0.3)] ${isPremiumBlocked ? 'opacity-30 grayscale' : ''}`}
             style={{ backgroundColor: primaryColor }}
             animate={isPlaying && !isPremiumBlocked ? { scale: [1, 1.1, 1] } : { scale: 1 }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           />
           
           {/* Premium Locked Overlay */}
           {isPremiumBlocked && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
               <div className="w-16 h-16 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center mb-2 border border-white/10 shadow-xl">
                  <Lock className="w-6 h-6 text-white" strokeWidth={1.5} />
               </div>
               <p className="text-white font-black text-[10px] uppercase tracking-[0.2em] bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">Premium Required</p>
             </div>
           )}
         </div>
      </div>

      {/* Minimal Footer Controls */}
      <div className="relative z-20 pb-16 pt-8 px-12 w-full max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Progress Line */}
        <div className="w-full mb-10 flex items-center gap-5">
          <div className="relative h-1 bg-white/5 flex-1 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            handleSeek((x / rect.width) * totalTime);
          }}>
            <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${progressPercentage}%`, backgroundColor: "rgba(255,255,255,0.2)" }} />
          </div>
          <span className="text-white/30 text-[11px] font-medium tracking-wide">{formatTime(totalTime)}</span>
        </div>

        {/* Playback Buttons Layout */}
        <div className="w-full flex items-center justify-between">
          
          <div className="w-10"></div> {/* Spacer to perfectly center the playback controls */}

          <div className="flex items-center gap-14">
            <button onClick={() => !isPremiumBlocked && handleSeek(Math.max(0, progress - 15))} className={`transition-colors ${isPremiumBlocked ? 'text-white/10' : 'text-white/30 hover:text-white'}`} disabled={isPremiumBlocked}>
              <SkipBack className="w-7 h-7" strokeWidth={1.5} />
            </button>
            
            {isPremiumBlocked ? (
              <button
                onClick={() => {
                  const currentLocale = window.location.pathname.split('/')[1] || 'vi';
                  window.location.href = `/${currentLocale}/pricing`;
                }}
                className="px-6 h-[4.25rem] rounded-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/20 hover:scale-105 transition-all uppercase tracking-widest font-black text-[10px]"
              >
                <Crown className="w-5 h-5" />
                Upgrade to UNLOCK
              </button>
            ) : (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-[4.25rem] h-[4.25rem] rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-lg shadow-black/20"
                style={{ backgroundColor: primaryColor }}
              >
                {isPlaying ? <Pause className="w-7 h-7 text-white fill-current" /> : <Play className="w-7 h-7 text-white fill-current ml-1.5" strokeWidth={0} />}
              </button>
            )}

            <button onClick={() => !isPremiumBlocked && handleSeek(Math.max(totalTime, progress + 15))} className={`transition-colors ${isPremiumBlocked ? 'text-white/10' : 'text-white/30 hover:text-white'}`} disabled={isPremiumBlocked}>
              <SkipForward className="w-7 h-7" strokeWidth={1.5} />
            </button>
          </div>

          {/* Volume controls */}
          <div className="relative flex items-center w-10 justify-end group">
            <button onClick={() => setShowVolumeSlider(!showVolumeSlider)} className="text-white/30 hover:text-white transition-colors">
              {volume === 0 ? <VolumeX className="w-5 h-5" strokeWidth={1.5} /> : <Volume2 className="w-5 h-5" strokeWidth={1.5} />}
            </button>
            
            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 100 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute bottom-10 right-0 w-8 bg-[#1a2028] border border-white/5 rounded-full py-4 flex justify-center shadow-2xl origin-bottom overflow-hidden"
                >
                  <input
                    type="range" min="0" max="1" step="0.01" value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 -rotate-90 accent-teal-500 cursor-ns-resize appearance-none bg-white/10 h-[3px] rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
