"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { PremiumGate } from "@/components/auth/PremiumGate";

interface MeditationPlayerUIProps {
  id: string;
}

export function MeditationPlayerUI({ id }: MeditationPlayerUIProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showGetReady, setShowGetReady] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { isPaid } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Block access to premium content if user is not paid
  const isPremiumBlocked = content?.isPremium && !isPaid;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
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
    if (!loading && showGetReady && !isPremiumBlocked) {
      const timer = setTimeout(() => setShowGetReady(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [loading, showGetReady, isPremiumBlocked]);

  useEffect(() => {
    if (!loading && isPremiumBlocked) {
      setShowPremiumGate(true);
    }
  }, [loading, isPremiumBlocked]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (id === "daily") {
          setContent({ title: "Deep Breathing", instructor: "Master Roy", duration: "10 min", isPremium: false, type: "Daily" });
          setLoading(false);
          return;
        }
        const res = await fetch(`http://localhost:5000/api/content/${id}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data);
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
  const primaryColor = isSleep ? "#14B8A6" : "#0D9488"; // Teal 400 for dark, Teal 600 for light
  const bgColor = isSleep ? "#111115" : "#1C2028";
  
  if (loading) {
    return <div className="fixed inset-0 z-[100] bg-[#111115] flex items-center justify-center text-white/50 text-sm tracking-widest uppercase">Loading...</div>;
  }

  // Premium content gate
  if (isPremiumBlocked) {
    return (
      <>
        <div className={`fixed inset-0 z-[100] flex flex-col font-sans overflow-hidden`} style={{ backgroundColor: bgColor }}>
          <div className="relative z-[2] flex flex-col items-center justify-center h-full text-center px-6">
            <h1 className="text-3xl font-serif mb-2 text-white">{content?.title}</h1>
            <p className="text-white/50 mb-8">{content?.instructor}</p>
          </div>
        </div>
        <PremiumGate
          open={showPremiumGate}
          onClose={() => { setShowPremiumGate(false); window.history.back(); }}
          contentTitle={content?.title}
        />
      </>
    );
  }

  if (showGetReady) {
    return (
      <div className={`fixed inset-0 z-[100] flex flex-col font-sans overflow-hidden items-center justify-center`} style={{ backgroundColor: bgColor }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center"
        >
          <span className="text-white/40 tracking-[0.2em] text-xs uppercase font-bold mb-4">Get ready</span>
          <h1 className="text-3xl md:text-4xl font-serif text-white">{content?.title || "Mindful Session"}</h1>
        </motion.div>
      </div>
    );
  }

  const progressPercentage = totalTime > 0 ? (progress / totalTime) * 100 : 0;

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col font-sans overflow-hidden transition-colors duration-1000`} style={{ backgroundColor: bgColor }}>
      
      {content?.audioUrl && (
        <audio ref={audioRef} src={content.audioUrl} loop preload="auto" />
      )}

      {/* Top Bar */}
      <div className="relative z-20 flex justify-between items-center px-6 py-8">
        <button
          onClick={() => window.history.back()}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>
        
        <div className="flex flex-col items-center">
          <h1 className="text-white font-serif text-xl mb-0.5">{content?.title}</h1>
          <span className="text-white/40 text-[10px] tracking-widest uppercase font-bold">{content?.type || "Single"}</span>
        </div>

        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`${isLiked ? 'text-rose-400' : 'text-white/60 hover:text-white'} transition-colors`}
        >
          <Heart className="w-6 h-6" strokeWidth={1.5} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Main Animation Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-6 overflow-hidden">
         {/* Balance-style abstract wave/line animation */}
         <div className="w-full max-w-lg h-64 relative flex items-center justify-center">
            <motion.svg className="w-full absolute" style={{ height: "40px" }} viewBox="0 0 100 20" preserveAspectRatio="none">
              <motion.path 
                d="M 0,10 Q 25,0 50,10 T 100,10" 
                fill="none" 
                stroke={isSleep ? "#0D9488" : "#CCFBF1"} 
                strokeWidth="0.5" 
                animate={isPlaying ? { d: ["M 0,10 Q 25,20 50,10 T 100,10", "M 0,10 Q 25,0 50,10 T 100,10"] } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path 
                d="M 0,10 Q 25,20 50,10 T 100,10" 
                fill="none" 
                stroke={isSleep ? "#14B8A6" : "#0D9488"} 
                strokeWidth="1.5"
                animate={isPlaying ? { d: ["M 0,10 Q 25,0 50,10 T 100,10", "M 0,10 Q 25,20 50,10 T 100,10"] } : {}}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.svg>
         </div>
      </div>

      {/* Minimal Footer Controls */}
      <div className="relative z-20 pb-12 pt-8 px-8 w-full max-w-xl mx-auto flex flex-col items-center">
        
        {/* Simple Progress Line */}
        <div className="w-full mb-10 flex items-center gap-4">
          <div className="relative h-1 bg-white/10 flex-1 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            handleSeek((x / rect.width) * totalTime);
          }}>
            <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${progressPercentage}%`, backgroundColor: primaryColor }} />
          </div>
          <span className="text-white/40 text-xs font-medium w-10 text-right">{formatTime(totalTime - progress)}</span>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-12">
          <button onClick={() => handleSeek(Math.max(0, progress - 15))} className="text-white/40 hover:text-white transition-colors">
            <SkipBack className="w-7 h-7" strokeWidth={1.5} />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            {isPlaying ? <Pause className="w-8 h-8 text-white fill-current" /> : <Play className="w-8 h-8 text-white fill-current ml-1" strokeWidth={0} />}
          </button>

          <button onClick={() => handleSeek(Math.max(totalTime, progress + 15))} className="text-white/40 hover:text-white transition-colors">
            <SkipForward className="w-7 h-7" strokeWidth={1.5} />
          </button>
        </div>

        {/* Volume controls off to the side, absolutely positioned */}
        <div className="absolute right-8 bottom-[4.5rem] flex items-center opacity-40 hover:opacity-100 transition-opacity">
          <button onClick={() => setShowVolumeSlider(!showVolumeSlider)} className="text-white">
            {volume === 0 ? <VolumeX className="w-5 h-5" strokeWidth={1.5} /> : <Volume2 className="w-5 h-5" strokeWidth={1.5} />}
          </button>
          
          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 100 }}
                exit={{ opacity: 0, height: 0 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-8 bg-[#15181F] border border-white/10 rounded-full py-4 flex justify-center shadow-lg origin-bottom overflow-hidden"
              >
                <input
                  type="range" min="0" max="1" step="0.01" value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 -rotate-90 accent-teal-500 cursor-ns-resize appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
