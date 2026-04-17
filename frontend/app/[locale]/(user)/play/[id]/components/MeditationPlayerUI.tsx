"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play/pause functionality linked to HTML5 Audio
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync volume state to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle manual scrubbing
  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setProgress(newTime);
  };

  // Sync real audio time to progress bar instead of fake interval
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => setProgress(audio.currentTime);
    audio.addEventListener("timeupdate", updateTime);
    return () => audio.removeEventListener("timeupdate", updateTime);
  }, [content]);

  // Auto transition from Get Ready screen to Main Player
  useEffect(() => {
    if (!loading && showGetReady) {
      const timer = setTimeout(() => setShowGetReady(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [loading, showGetReady]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (id === "daily") {
           setContent({ title: "Deep Breathing", instructor: "Master Roy", duration: "10 min", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5?q=80&w=2000" });
           setLoading(false);
           return;
        }
        const res = await fetch(`http://localhost:5000/api/content/${id}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        } else {
          // Fallback if not found
          setContent({ title: "Mindful Session", instructor: "Oasis", duration: "10 min", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5?q=80&w=2000" });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  // Parse total time from DB or use the real audio's duration if available
  const totalTime = audioRef.current?.duration && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0 
    ? audioRef.current.duration 
    : (content?.duration ? parseInt(content.duration.split(" ")[0]) * 60 : 3600);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
     return <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center text-white font-serif text-2xl tracking-widest">Breathing in...</div>;
  }

  if (showGetReady) {
    return (
      <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col font-sans overflow-hidden items-center justify-center">
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-screen scale-110 object-cover"
          style={{
            backgroundImage: `url('${content?.image || "https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5"}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: "blur(35px) saturate(1.2)"
          }}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center"
        >
          <span className="text-white/60 tracking-[0.3em] text-sm md:text-base uppercase font-bold mb-6">Preparing to enter</span>
          <h1 className="text-5xl md:text-7xl font-serif drop-shadow-2xl leading-tight mb-16">{content?.title || "Mindful Session"}</h1>
          
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-xl md:text-2xl font-light text-white/90 italic drop-shadow-md"
          >
            Get ready...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const progressPercentage = totalTime > 0 ? (progress / totalTime) * 100 : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Background Ambient Video/Image mapped from content itself! */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-screen scale-110 object-cover"
        style={{
          backgroundImage: `url('${content?.image || "https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5"}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: "blur(25px) saturate(1.8)"
        }}
      />
      
      {/* Overlay to give focus to the UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-[#0A0A0C]/50 z-0 pointer-events-none" />

      {/* Hidden Audio Element */}
      {content?.audioUrl && (
        <audio 
          ref={audioRef} 
          src={content.audioUrl} 
          loop 
          preload="auto" 
        />
      )}

      {/* Top Bar */}
      <div className="relative z-[1000] flex justify-between items-center px-6 py-6 pt-12 cursor-pointer">
        <button 
          onClick={() => window.history.back()} 
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex gap-4 relative">
          <button 
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
          >
            {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute top-16 right-0 bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 rounded-full py-6 px-3 shadow-2xl flex flex-col items-center"
              >
                <div className="h-32 flex items-center justify-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-28 -rotate-90 accent-indigo-500 cursor-ns-resize appearance-none bg-white/10 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 mt-[-15vh] lg:mt-[-12vh]">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-10"
        >
          <span className="text-white/60 tracking-[0.2em] text-xs uppercase font-bold mb-3 block">Foundation Focus {id !== "daily" ? `(${content?.type || 'Meditation'})` : ""}</span>
          <h1 className="text-4xl md:text-5xl font-serif mb-2 max-w-2xl leading-tight">{content?.title || "Deep Breathing"}</h1>
          <p className="text-white/70">{content?.instructor || "Master Roy"} {content?.type ? `• ${content.type}` : "• Series 1"}</p>
        </motion.div>

        {/* Circular Timer UI */}
        <div className="relative flex items-center justify-center mb-10 mt-2">
          <svg className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] transform -rotate-90 drop-shadow-2xl">
            <circle cx="50%" cy="50%" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
            <circle 
              cx="50%" cy="50%" r={radius} 
              stroke="white" strokeWidth="6" fill="none" 
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
              className="transition-all duration-300 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-5xl md:text-6xl font-medium font-serif drop-shadow-lg leading-none">{formatTime(progress)}</span>
            <span className="text-white/50 text-sm mt-3 tracking-widest uppercase">/ {formatTime(totalTime)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-10">
          <button 
            onClick={() => handleSeek(Math.max(0, progress - 15))}
            className="text-white/60 hover:text-white transition-colors"
          >
            <SkipBack className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-10 h-10 md:w-12 md:h-12 fill-current" /> : <Play className="w-10 h-10 md:w-12 md:h-12 fill-current ml-1" />}
          </button>

          <button 
            onClick={() => handleSeek(Math.min(totalTime, progress + 15))}
            className="text-white/60 hover:text-white transition-colors"
          >
            <SkipForward className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        </div>
      </div>
    </div>
  );
}
