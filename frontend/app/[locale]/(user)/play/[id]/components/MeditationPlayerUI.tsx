"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Heart, Lock, Crown, CheckCircle2, RotateCcw, ChevronDown, User, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const COMPLETION_THRESHOLD = 0.85;
const SYNC_INTERVAL_MS = 10_000;

const COMPLETION_MESSAGES = [
  { title: "✨ Session Complete", body: "Your mind is a still lake now. Carry this peace into the rest of your day." },
  { title: "🌿 Well Done", body: "You have given yourself the gift of stillness. The roots grow deeper with every breath." },
  { title: "🌙 Beautiful Practice", body: "The universe has witnessed your intention. Rest now, dear soul." },
  { title: "🍃 Journey Complete", body: "Every moment of mindfulness plants a seed. You are blooming." },
  { title: "💫 Inner Work Done", body: "Silence is not empty — it is full of answers. You have listened well." },
];

interface MeditationPlayerUIProps {
  id: string;
}

export function MeditationPlayerUI({ id }: MeditationPlayerUIProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const searchParams = useSearchParams();
  const startAt = parseInt(searchParams.get("startAt") || "0");

  const [progress, setProgress] = useState(startAt);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showCoachProfile, setShowCoachProfile] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(true); 
  const [completionMsg] = useState(COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)]);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false); 
  
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("rest");

  const { isPaid, isLoading: authLoading, refetch } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStarted = useRef(false);

  const [audioDuration, setAudioDuration] = useState(0);

  const totalTime = useMemo(() => {
    if (content?.duration) {
      if (content.duration.includes(":")) {
        const [m, s] = content.duration.split(":").map((n: string) => parseInt(n) || 0);
        return (m * 60) + s;
      }
      const parts = content.duration.split(" ");
      const parsed = parseInt(parts[0]);
      if (!isNaN(parsed)) return parsed * 60;
    }

    if (audioDuration > 0) {
      return audioDuration;
    }

    return 300; 
  }, [content?.duration, audioDuration]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isPremiumBlocked = !authLoading && content?.isPremium && !isPaid;

  const syncProgress = useCallback(async (currentProgress: number, total: number, completed: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isPremiumBlocked) return;

      const res = await fetch(`${API}/api/sessions/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          contentId: id,
          watchedDuration: Math.floor(currentProgress),
          totalDuration: Math.floor(total),
          isCompleted: completed
        })
      });

      if (res.ok && completed && !hasCompleted) {
        setHasCompleted(true);
        setIsPlaying(false);
        setShowCompletion(true);

        const cat = content?.category || content?.type;
        const skillKey = 
          cat === "Focus" || cat === "Thiền định" ? "focus" :
          cat === "Relaxation" || cat === "Thư giãn" ? "relaxation" :
          cat === "Breath" || cat === "Hơi thở" ? "breathControl" : "awareness";
          
        await fetch(`${API}/api/users/me/skills`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ skill: skillKey, points: 5 })
        });
        refetch(); 

        await fetch(`${API}/api/journey/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ contentId: id, durationMinutes: Math.floor(currentProgress / 60) || 5 }),
        });
      }
    } catch (e) {
      console.error("Sync failed:", e);
    }
  }, [content, id, hasCompleted, refetch]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && content?.audioUrl) {
        if (audioRef.current.readyState < 1) {
          audioRef.current.load();
        }
        audioRef.current.currentTime = startAt;
        audioRef.current.play().catch((err) => {
          console.error("Playback blocked or failed:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, content?.audioUrl]);

  useEffect(() => {
    if (!isPlaying || content?.type !== "Hơi thở") return;
    let isActive = true;

    const runCycle = async () => {
      if (!isActive) return;
      setBreathPhase("inhale");
      await new Promise(r => setTimeout(r, 4000));
      
      if (!isActive) return;
      setBreathPhase("hold");
      await new Promise(r => setTimeout(r, 7000));
      
      if (!isActive) return;
      setBreathPhase("exhale");
      await new Promise(r => setTimeout(r, 8000));

      if (isActive) runCycle();
    };

    runCycle();
    return () => { isActive = false; };
  }, [isPlaying, content?.type]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!isPlaying || hasCompleted || showSuggestion) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        let next = prev + 1;
        
        if (content?.type === "Thiền định" && audioRef.current && !audioRef.current.paused) {
          next = audioRef.current.currentTime;
        }

        if (totalTime > 0 && next >= totalTime) {
          syncProgress(totalTime, totalTime, true);
          setHasCompleted(true);
          setShowCompletion(true);
          setIsPlaying(false);
          return totalTime;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, hasCompleted, showSuggestion, totalTime, content?.type]);

  useEffect(() => {
    if (!isPlaying || !content || hasCompleted) {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
      return;
    }

    syncIntervalRef.current = setInterval(() => {
      syncProgress(progress, totalTime, progress / totalTime >= COMPLETION_THRESHOLD);
    }, SYNC_INTERVAL_MS);

    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [isPlaying, content, hasCompleted, progress, totalTime, syncProgress]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!audioRef.current || hasCompleted) return;
      const watched = audioRef.current.currentTime;
      const total = audioRef.current.duration || 0;
      if (watched < 10) return;
      const token = localStorage.getItem("token");
      if (!token || !content || isPremiumBlocked) return;
      navigator.sendBeacon(`${API}/api/sessions/progress`, JSON.stringify({
        contentId: id,
        contentTitle: content.title,
        totalDuration: total,
        watchedDuration: watched,
      }));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [content, id, hasCompleted]);

  const handleSeek = (newTime: number) => {
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (id === "daily") {
          setContent({ title: "Deep Breathing", instructor: "Master Roy", duration: "10 min", isPremium: false, type: "Daily" });
          setLoading(false);
          return;
        }
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/content/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (res.ok) {
          const data = await res.json();
          let finalContent = { ...data };

          const urlParams = new URLSearchParams(window.location.search);
          const lessonIndex = urlParams.get("lessonIndex");
          if (lessonIndex !== null && data.lessons?.[parseInt(lessonIndex)]) {
            const lesson = data.lessons[parseInt(lessonIndex)];
            finalContent = { 
              ...finalContent, 
              title: lesson.title || `Day ${parseInt(lessonIndex) + 1}`, 
              description: lesson.description || data.description, 
              suggestion: lesson.suggestion || "Take a deep breath and settle into a comfortable position.",
              duration: lesson.duration || data.duration, 
              audioUrl: lesson.audioUrl || data.audioUrl, 
              type: lesson.type || "Thiền định" 
            };
          }

          if (typeof finalContent.instructor === 'string') {
            try {
              const coachesRes = await fetch(`${API}/api/users/coaches`);
              if (coachesRes.ok) {
                const coaches = await coachesRes.json();
                const matchedCoach = coaches.find((c: any) => c.name.trim().toLowerCase() === finalContent.instructor.trim().toLowerCase());
                if (matchedCoach) {
                  finalContent.instructor = {
                    name: matchedCoach.name,
                    avatar: matchedCoach.coachProfile?.avatar || matchedCoach.avatar,
                    bio: matchedCoach.coachProfile?.bio || ""
                  };
                }
              }
            } catch (e) {
              console.error("Failed to fetch coaches:", e);
            }
          }

          setContent(finalContent);
        } else if (res.status === 403) {
          const errorData = await res.json();
          setContent({ title: "Access Restricted", instructor: "Subscription Required", duration: "", isPremium: true, type: "Locked", description: errorData.message || "Please subscribe." });
        } else {
          setContent({ title: "Mindful Session", instructor: "Lunaria", duration: "10 min", isPremium: false, type: "Meditation" });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);



  const router = useRouter();

  const handleBack = () => {
    if (!hasCompleted && totalTime > 0 && progress / totalTime < COMPLETION_THRESHOLD) {
      setShowExitWarning(true);
    } else {
      router.push("/");
    }
  };

  if (loading || authLoading) {
    return <div className="fixed inset-0 z-[100] bg-[#1c222b] flex items-center justify-center text-white/50 text-sm tracking-widest uppercase">Loading...</div>;
  }

  const progressPercentage = totalTime > 0 ? (progress / totalTime) * 100 : 0;
  const audioSrc = content?.audioUrl?.trim() || null;
  const isSleep = content?.type === "Ngủ";
  const primaryColor = isSleep ? "#14B8A6" : "#2DD4BF";
  const bgColor = isSleep ? "#111115" : "#1c222b";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-sans overflow-hidden transition-colors duration-1000" style={{ backgroundColor: bgColor }}>
      {content?.audioUrl && content.audioUrl.startsWith('http') && !isPremiumBlocked && (
        <audio
          ref={audioRef}
          key={content.audioUrl}
          preload="metadata"
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setAudioDuration(audioRef.current.duration);
              if (startAt > 0) audioRef.current.currentTime = startAt;
            }
          }}
          onError={(e) => {
            console.warn("Audio suppressed:", content.audioUrl);
            e.preventDefault();
          }}
          onEnded={() => {
            syncProgress(totalTime, totalTime, true);
          }}
        >
          <source src={content.audioUrl} type="audio/mpeg" />
          <source src={content.audioUrl} type="audio/ogg" />
          <source src={content.audioUrl} type="audio/wav" />
        </audio>
      )}

      <div className="relative z-20 flex justify-between items-start px-8 py-10">
        <button onClick={handleBack} className="text-white/50 hover:text-white transition-colors">
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <div className="flex flex-col items-center mt-1">
          <h1 className="text-white font-serif text-[1.35rem] font-medium tracking-wide mb-1.5">{content?.title}</h1>
          <span className="text-white/40 text-[9px] tracking-[0.25em] uppercase font-bold">{content?.type?.toUpperCase() || "PLAN LESSON"}</span>
        </div>
        <button onClick={() => setIsLiked(!isLiked)} className={`${isLiked ? "text-rose-400" : "text-white/50 hover:text-white"} transition-colors`}>
          <Heart className="w-6 h-6" strokeWidth={1.5} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>

      <AnimatePresence>
        {showSuggestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#1c222b] flex flex-col items-center justify-center px-8"
          >
            <div className="max-w-sm w-full text-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-teal-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-teal-500/20"
              >
                <div className="w-10 h-10 text-teal-400">
                  {content?.type === "Hơi thở" ? <RotateCcw className="w-full h-full" /> : 
                   content?.type === "Ngủ" ? <Moon className="w-full h-full" /> :
                   content?.type === "Thư giãn" ? <CheckCircle2 className="w-full h-full" /> :
                   <Pause className="w-full h-full" />}
                </div>
              </motion.div>
              
              <h2 className="text-white font-serif text-3xl mb-6 tracking-wide">{content?.title}</h2>
              
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-12">
                <p className="text-teal-400 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Today's Suggestion</p>
                <p className="text-white/80 text-lg leading-relaxed font-light italic">
                  "{content?.suggestion || "Find a quiet space and allow yourself to be fully present."}"
                </p>
              </div>

              <button
                onClick={() => { setShowSuggestion(false); setIsPlaying(true); }}
                className="w-full py-5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-95"
              >
                Begin Session
              </button>
              
              <button 
                onClick={() => router.push("/")}
                className="mt-6 text-white/30 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-6 overflow-hidden">
        <div className="relative flex items-center justify-center w-64 h-64">
          {content?.type === "Hơi thở" ? (
             <motion.div 
               animate={{ 
                 scale: breathPhase === "inhale" || breathPhase === "hold" ? 1.8 : 1,
                 opacity: breathPhase === "rest" ? 0.3 : 1
               }}
               transition={{ duration: breathPhase === "inhale" ? 4 : breathPhase === "exhale" ? 8 : 0.5 }}
               className="w-32 h-32 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 blur-xl opacity-60"
             />
          ) : (
            <>
              <motion.div className="absolute w-56 h-56 rounded-full border border-white/5" animate={isPlaying && !isPremiumBlocked ? { scale: [1, 1.1, 1] } : { scale: 1 }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
              <motion.div className="absolute w-40 h-40 rounded-full border border-white/5" animate={isPlaying && !isPremiumBlocked ? { scale: [1, 1.15, 1] } : { scale: 1 }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
              <motion.div className="absolute w-28 h-28 rounded-full blur-2xl" style={{ backgroundColor: primaryColor, opacity: 0.2 }} animate={isPlaying && !isPremiumBlocked ? { scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] } : { scale: 1 }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
              <motion.div className={`absolute w-[3.25rem] h-[3.25rem] rounded-full shadow-[0_0_20px_rgba(45,212,191,0.3)] ${isPremiumBlocked ? "opacity-30 grayscale" : ""}`} style={{ backgroundColor: primaryColor }} animate={isPlaying && !isPremiumBlocked ? { scale: [1, 1.1, 1] } : { scale: 1 }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
            </>
          )}
          
          {isPremiumBlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="w-16 h-16 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center mb-2 border border-white/10 shadow-xl">
                <Lock className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <p className="text-white font-black text-[10px] uppercase tracking-[0.2em] bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">Premium Required</p>
            </div>
          )}
        </div>

        <div className="h-20 flex flex-col items-center justify-center mt-8">
          <AnimatePresence mode="wait">
            {content?.type === "Hơi thở" && isPlaying && (
              <motion.h2 
                key={breathPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl font-serif text-teal-100 tracking-wide"
              >
                {breathPhase === "inhale" ? "Hít vào..." : breathPhase === "hold" ? "Giữ hơi..." : breathPhase === "exhale" ? "Thở ra chậm..." : "Chuẩn bị..."}
              </motion.h2>
            )}
          </AnimatePresence>
          <div className="mt-4 text-center">
            <p className="text-white/20 text-[11px] font-mono tracking-[0.15em]">
              {formatTime(Math.max(0, totalTime - progress))}
            </p>
          </div>
        </div>

      </div>

      <div className="relative z-40 flex flex-col items-center mb-6 pointer-events-auto">
        <button 
          onClick={() => setShowCoachProfile(!showCoachProfile)}
          className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all shadow-lg active:scale-95"
        >
          <div className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center overflow-hidden border border-white/20 shadow-sm">
            {content?.instructor?.avatar ? (
              <img src={content.instructor.avatar} alt="Coach" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white/50" strokeWidth={1.5} />
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-black">Instructor</span>
            <div className="flex items-center gap-1.5 text-white">
              <span className="font-semibold text-sm tracking-wide capitalize">
                {typeof content?.instructor === 'object' ? content.instructor.name : (content?.instructor || "Unknown Coach")}
              </span>
              <motion.div animate={{ rotate: showCoachProfile ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" strokeWidth={2.5} />
              </motion.div>
            </div>
          </div>
        </button>

        <AnimatePresence>
          {showCoachProfile && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-[115%] w-[320px] bg-[#1a2028]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl z-50 origin-bottom"
            >
              {content?.instructor ? (
                 <div className="flex flex-col items-center">
                   <div className="relative mb-3">
                     <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-teal-500/50 shadow-[0_0_15px_rgba(45,212,191,0.2)] bg-slate-800">
                        {content.instructor.avatar ? (
                          <img src={content.instructor.avatar} alt="Coach" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-white/50" strokeWidth={1} />
                        )}
                     </div>
                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[#1a2028]">
                       PRO
                     </div>
                   </div>
                   
                   <h4 className="text-white font-serif text-xl font-medium tracking-wide mb-1 capitalize">
                     {typeof content.instructor === 'object' ? content.instructor.name : content.instructor}
                   </h4>
                   <p className="text-teal-400 text-[10px] uppercase tracking-widest font-bold mb-4">Certified Lunaria Guide</p>
                   
                   <div className="w-full max-h-[140px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
                     <p className="text-white/60 text-xs leading-relaxed text-center italic">
                       {typeof content?.instructor === 'object' && content.instructor.bio 
                         ? `"${content.instructor.bio}"`
                         : '"A dedicated guide on your mindfulness journey with Lunaria."'}
                     </p>
                   </div>
                 </div>
              ) : (
                 <div className="text-center py-4">
                   <User className="w-10 h-10 text-white/20 mx-auto mb-3" />
                   <h4 className="text-sm font-bold text-white mb-0.5">Lunaria Support</h4>
                   <p className="text-[10px] text-slate-400 font-medium">Have an issue? Message us now</p>
                 </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-20 pb-16 pt-8 px-12 w-full max-w-3xl mx-auto flex flex-col items-center">
        <div className="w-full mb-10 flex items-center gap-5">
          <div className="relative h-1 bg-white/5 flex-1 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            handleSeek(((e.clientX - rect.left) / rect.width) * totalTime);
          }}>
            <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${progressPercentage}%`, backgroundColor: "rgba(255,255,255,0.2)" }} />
          </div>
          <span className="text-white/30 text-[11px] font-medium tracking-wide">{formatTime(totalTime)}</span>
        </div>

        <div className="w-full flex items-center justify-between">
          <div className="w-10" />
          <div className="flex items-center gap-14">
            <button onClick={() => !isPremiumBlocked && handleSeek(Math.max(0, progress - 15))} className={`transition-colors ${isPremiumBlocked ? "text-white/10" : "text-white/30 hover:text-white"}`} disabled={isPremiumBlocked}>
              <SkipBack className="w-7 h-7" strokeWidth={1.5} />
            </button>
            {isPremiumBlocked ? (
              <button onClick={() => { const l = window.location.pathname.split("/")[1] || "vi"; window.location.href = `/${l}/pricing`; }} className="px-6 h-[4.25rem] rounded-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/20 hover:scale-105 transition-all uppercase tracking-widest font-black text-[10px]">
                <Crown className="w-5 h-5" /> Upgrade to UNLOCK
              </button>
            ) : (
              <button onClick={() => setIsPlaying(!isPlaying)} className="w-[4.25rem] h-[4.25rem] rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-lg shadow-black/20" style={{ backgroundColor: primaryColor }}>
                {isPlaying ? <Pause className="w-7 h-7 text-white fill-current" /> : <Play className="w-7 h-7 text-white fill-current ml-1.5" strokeWidth={0} />}
              </button>
            )}
            <button onClick={() => !isPremiumBlocked && handleSeek(Math.min(totalTime, progress + 15))} className={`transition-colors ${isPremiumBlocked ? "text-white/10" : "text-white/30 hover:text-white"}`} disabled={isPremiumBlocked}>
              <SkipForward className="w-7 h-7" strokeWidth={1.5} />
            </button>
          </div>

          <div className="relative flex items-center w-10 justify-end">
            <button onClick={() => setShowVolumeSlider(!showVolumeSlider)} className="text-white/30 hover:text-white transition-colors">
              {volume === 0 ? <VolumeX className="w-5 h-5" strokeWidth={1.5} /> : <Volume2 className="w-5 h-5" strokeWidth={1.5} />}
            </button>
            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9, y: 10 }} 
                  className="absolute bottom-full right-0 mb-4 w-10 bg-[#1a2028] border border-white/10 rounded-2xl py-6 flex flex-col items-center shadow-2xl z-50 overflow-hidden"
                >
                  <div className="h-24 flex items-center">
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={volume} 
                      onChange={(e) => setVolume(parseFloat(e.target.value))} 
                      className="w-20 -rotate-90 accent-teal-500 cursor-pointer appearance-none bg-white/10 h-[3px] rounded-full outline-none" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-6"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowCompletion(false)} />
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="relative w-full max-w-sm bg-[#111820] border border-white/10 rounded-[2.5rem] px-8 pt-10 pb-10 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 220 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "radial-gradient(circle, rgba(45,212,191,0.2) 0%, transparent 70%)", border: "2px solid rgba(45,212,191,0.3)" }}
              >
                <CheckCircle2 className="w-10 h-10 text-teal-400" strokeWidth={1.5} />
              </motion.div>

              <h2 className="text-white font-serif text-2xl mb-3">{completionMsg.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed italic mb-8 max-w-xs mx-auto">
                "{completionMsg.body}"
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowCompletion(false); router.push("/"); }}
                  className="flex-1 py-4 rounded-2xl bg-teal-500 text-white font-bold tracking-wide hover:bg-teal-400 transition-colors"
                >
                  Continue Journey
                </button>
                <button
                  onClick={() => { setShowCompletion(false); setProgress(0); setHasCompleted(false); if (audioRef.current) { audioRef.current.currentTime = 0; } setIsPlaying(true); }}
                  className="px-5 py-4 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExitWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center px-6"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowExitWarning(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xs bg-[#1a2028] border border-white/10 rounded-[2.5rem] p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/30">
                <RotateCcw className="w-8 h-8 text-rose-500" />
              </div>
              <div className="text-center">
              <h3 className="text-white font-serif text-xl mb-4">Session Incomplete</h3>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed px-4">
                Mindfulness requires patience. Are you sure you want to stop now?
              </p>

              <div className="space-y-4">
                <button 
                  onClick={() => setShowExitWarning(false)}
                  className="w-full py-5 bg-teal-500 text-slate-900 rounded-[2rem] font-bold text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  Continue Practice
                </button>
                <button 
                  onClick={() => {
                    syncProgress(progress, totalTime, false);
                    router.push("/");
                  }}
                  className="w-full py-5 bg-white/5 text-slate-400 rounded-[2rem] font-bold text-sm hover:bg-white/10 transition-all"
                >
                  End Session
                </button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
