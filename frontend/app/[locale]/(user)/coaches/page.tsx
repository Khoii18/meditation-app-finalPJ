"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Clock, CheckCircle2, X, ChevronRight,
  Sparkles, Users, Award, BookOpen, Loader2, PlayCircle, Lock
} from "lucide-react";

interface Exercise {
  title: string;
  duration: string;
  audioUrl: string;
}

interface Package {
  _id?: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  exercises?: Exercise[];
  highlighted: boolean;
}

interface Coach {
  _id: string;
  name: string;
  email: string;
  coachProfile: {
    bio: string;
    specialties: string[];
    avatar: string;
    introVideo?: string;
    plans: Package[];
  };
}

function CoachDetailModal({ coach, onClose }: { coach: Coach; onClose: () => void }) {
  const [playingMedia, setPlayingMedia] = useState<string | null>(null);
  
  const profile = coach.coachProfile || {};
  const plans = profile.plans || [];
  const specialties = profile.specialties || [];

  const renderVideoPlayer = (url: string) => {
    if (!url) return null;
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
    if (isYouTube) {
      let videoId = "";
      if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
      else if (url.includes("v=")) videoId = url.split("v=")[1]?.split("&")[0];
      
      if (videoId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0 bg-black"
          />
        );
      }
    }
    return (
      <video src={url} autoPlay controls className="w-full h-full object-cover bg-black" />
    );
  };

  const SPECIALTY_COLORS = [
    "bg-indigo-500/20 text-indigo-300",
    "bg-violet-500/20 text-violet-300",
    "bg-emerald-500/20 text-emerald-300",
    "bg-amber-500/20 text-amber-300",
    "bg-rose-500/20 text-rose-300",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0E0E14] border border-white/10 rounded-3xl shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {/* Hero header */}
        <div className="relative h-40 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-t-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar + name */}
        <div className="px-8 pb-8">
          <div className="relative z-10 flex items-end gap-5 -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl border-4 border-[#0E0E14] bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-xl">
              {profile.avatar ? (
                <img src={profile.avatar} alt={coach.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                coach.name?.[0]?.toUpperCase() || "?"
              )}
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-bold text-white shadow-black/50 drop-shadow-md">{coach.name}</h2>
              <p className="text-slate-200 text-sm drop-shadow-md">{coach.email}</p>
            </div>
          </div>

          {/* Specialties */}
          {specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {specialties.map((s, i) => (
                <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${SPECIALTY_COLORS[i % SPECIALTY_COLORS.length]}`}>
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Bio */}
          {profile.bio && (
            <div className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/5">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">About</p>
              <p className="text-slate-300 leading-relaxed text-sm">{profile.bio}</p>
            </div>
          )}

          {/* Currently Playing Exercise Media */}
          {playingMedia && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-indigo-500/50 bg-black aspect-video relative group shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <div className="absolute top-3 right-3 z-10">
                <button onClick={() => setPlayingMedia(null)} className="w-8 h-8 bg-black/60 hover:bg-rose-500 text-white rounded-full flex items-center justify-center transition-colors shadow-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {renderVideoPlayer(playingMedia)}
            </div>
          )}

          {/* Intro Video */}
          {profile.introVideo && !playingMedia && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video relative group shadow-lg">
              {renderVideoPlayer(profile.introVideo)}
            </div>
          )}

          {/* Packages */}
          {plans.length > 0 ? (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Meditation Packages
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {plans.map((plan, i) => (
                  <div
                    key={i}
                    className={`relative flex flex-col h-full rounded-2xl p-5 border ${
                      plan.highlighted
                        ? "bg-gradient-to-br from-indigo-600/30 to-violet-600/20 border-indigo-500/40"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    {plan.highlighted && (
                      <span className="absolute -top-2.5 left-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                    <h4 className="text-lg font-semibold text-white mb-1">{plan.name}</h4>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-white">
                        {plan.price === 0 ? "Free" : `${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-sm text-slate-400">
                          {plan.currency} / {plan.period}
                        </span>
                      )}
                    </div>
                    {(plan.features || []).length > 0 && (
                      <ul className="space-y-2 mb-5">
                        {plan.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    {(plan.exercises || []).length > 0 && (
                      <div className="pt-4 border-t border-white/10 mt-auto">
                        <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-500 mb-3 flex items-center justify-between">
                          <span>Curriculum</span>
                          <span className="text-indigo-400 font-medium normal-case tracking-normal">{plan.exercises!.length} lessons</span>
                        </p>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {(plan.exercises || []).map((ex, ei) => (
                            <div key={ei} className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors group">
                               <div className="flex items-center gap-3 overflow-hidden">
                                 <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                                   <PlayCircle className="w-4 h-4" />
                                 </div>
                                 <div className="truncate text-left pr-2">
                                   <p className="text-sm font-medium text-slate-200 truncate">{ex.title}</p>
                                   <p className="text-xs text-slate-500">{ex.duration || "Self-paced"}</p>
                                 </div>
                               </div>
                               <button 
                                 onClick={() => setPlayingMedia(ex.audioUrl)}
                                 className="shrink-0 p-1.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-full transition-colors"
                                 title="Preview Exercise"
                               >
                                 <PlayCircle className="w-4 h-4" />
                               </button>
                            </div>
                          ))}
                        </div>
                        <button className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-3 rounded-xl transition-colors">
                          Subscribe (Preview Mode Unlocked)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 bg-white/5 rounded-2xl border border-white/5 text-sm">
              This coach hasn't added packages yet
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Coach Card ──────────────────────────────────────────────────────────────
function CoachCard({ coach, onClick }: { coach: Coach; onClick: () => void }) {
  const profile = coach.coachProfile || {};
  const specialties = profile.specialties || [];
  const plans = profile.plans || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="bg-[#111118] border border-white/8 rounded-3xl overflow-hidden cursor-pointer group hover:border-indigo-500/30 transition-colors"
    >
      {/* Card top gradient */}
      <div className="h-28 bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle at 30% 70%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        {plans.length > 0 && (
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 text-xs text-white">
            <BookOpen className="w-3 h-3" /> {plans.length} {plans.length === 1 ? "package" : "packages"}
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Avatar */}
        <div className="relative z-10 w-16 h-16 rounded-2xl border-4 border-[#111118] bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold -mt-10 mb-4 shadow-xl shrink-0">
          {profile.avatar ? (
            <img src={profile.avatar} alt={coach.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            coach.name?.[0]?.toUpperCase() || "?"
          )}
        </div>

        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">{coach.name}</h3>

        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
            {specialties.slice(0, 3).map((s, i) => (
              <span key={i} className="text-[11px] bg-white/8 text-slate-400 px-2.5 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        )}

        {profile.bio ? (
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">{profile.bio}</p>
        ) : (
          <p className="text-slate-600 text-xs italic mb-4">No bio available yet</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Users className="w-3.5 h-3.5" />
            <span>{plans.length} package{plans.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-400 text-xs font-medium group-hover:gap-2 transition-all">
            View profile <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Coach | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/users/coaches")
      .then((r) => r.json())
      .then((data) => {
        setCoaches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = coaches.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.coachProfile?.bio?.toLowerCase().includes(q) ||
      c.coachProfile?.specialties?.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-12 pb-24">
      {/* Header */}
      <header className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border border-indigo-500/20 mb-5">
          <Award className="w-3.5 h-3.5" /> Expert Coaches
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-slate-100 mb-3">
          Find Your Coach
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Browse our certified meditation coaches and explore their unique programs to find your perfect match.
        </p>
      </header>

      {/* Search bar */}
      <div className="mb-8 relative max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by name, specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111118] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-slate-500 text-sm">Loading coaches...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🧘</div>
          <p className="text-slate-400 text-lg mb-2">No coaches found</p>
          <p className="text-slate-600 text-sm">Try a different search term</p>
        </div>
      ) : (
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {filtered.map((coach) => (
            <CoachCard key={coach._id} coach={coach} onClick={() => setSelected(coach)} />
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <CoachDetailModal coach={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
