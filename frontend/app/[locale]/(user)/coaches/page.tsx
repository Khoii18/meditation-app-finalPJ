"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Clock, CheckCircle2, X, ChevronRight,
  Sparkles, Users, Award, BookOpen, Loader2, PlayCircle, Lock, Crown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthGateway } from "@/components/auth/AuthGateway";

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
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const { isLoggedIn, token, subscribedCoachIds, refetch } = useAuth();
  const [showAuthGateway, setShowAuthGateway] = useState(false);
  
  const isSubscribed = subscribedCoachIds.includes(coach._id);
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

  const handleSubscribe = async (planName: string) => {
    if (!isLoggedIn) {
      setShowAuthGateway(true);
      return;
    }
    
    setSubscribing(planName);
    try {
      const res = await fetch("http://localhost:5000/api/subscription/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ coachId: coach._id, planName })
      });
      if (res.ok) {
        alert(`Successfully subscribed to ${coach.name}'s ${planName} plan!`);
        refetch(); // Refresh sub status
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribing(null);
    }
  };

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
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-3xl shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
            <div className="w-24 h-24 rounded-2xl border-4 border-surface bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-xl overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={coach.name} className="w-full h-full object-cover" />
              ) : (
                coach.name?.[0]?.toUpperCase() || "?"
              )}
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-bold text-white shadow-black/50 drop-shadow-md">{coach.name}</h2>
              <p className="text-white/80 text-sm drop-shadow-md">{coach.email}</p>
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
            <div className="bg-background/50 rounded-2xl p-5 mb-6 border border-border">
              <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-2 opacity-70">About</p>
              <p className="text-foreground/90 leading-relaxed text-sm">{profile.bio}</p>
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
              <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-4 flex items-center gap-2 opacity-70">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Meditation Packages
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {plans.map((plan, i) => (
                    <div
                      key={i}
                      className={`relative flex flex-col h-full rounded-2xl p-5 border ${
                        plan.highlighted
                          ? "bg-indigo-500/5 border-indigo-500/30 shadow-sm"
                          : "bg-background/50 border-border"
                      }`}
                    >
                    {plan.highlighted && (
                      <span className="absolute -top-2.5 left-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                    <h4 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h4>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-foreground">
                        {plan.price === 0 ? "Free" : `${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-sm text-muted">
                          {plan.currency} / {plan.period}
                        </span>
                      )}
                    </div>
                    {(plan.features || []).length > 0 && (
                      <ul className="space-y-2 mb-5">
                        {plan.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-sm text-muted">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    {(plan.exercises || []).length > 0 && (
                      <div className="pt-4 border-t border-border mt-auto">
                        <p className="text-[11px] uppercase tracking-widest font-semibold text-muted mb-3 flex items-center justify-between opacity-70">
                          <span>Curriculum</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium normal-case tracking-normal">{plan.exercises!.length} lessons</span>
                        </p>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {(plan.exercises || []).map((ex, ei) => (
                            <div key={ei} className="flex items-center justify-between p-2.5 rounded-xl bg-background/50 border border-border hover:border-teal-500/30 transition-colors group">
                               <div className="flex items-center gap-3 overflow-hidden">
                                 <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                   <PlayCircle className="w-4 h-4" />
                                 </div>
                                 <div className="truncate text-left pr-2">
                                   <p className="text-sm font-medium text-foreground truncate">{ex.title}</p>
                                   <p className="text-xs text-muted opacity-70">{ex.duration || "Self-paced"}</p>
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
                        <button 
                          onClick={() => !isSubscribed && handleSubscribe(plan.name)}
                          disabled={subscribing === plan.name}
                          className={`w-full mt-5 font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                            isSubscribed 
                              ? "bg-slate-800 text-slate-400 cursor-default" 
                              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20 hover:scale-[1.02] active:scale-95"
                          }`}
                        >
                          {subscribing === plan.name ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isSubscribed ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Subscribed
                            </>
                          ) : (
                            <>
                              <Crown className="w-4 h-4" />
                              Subscribe to Unlock
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted bg-background/50 rounded-2xl border border-border text-sm opacity-70">
              This coach hasn't added packages yet
            </div>
          )}
        </div>
      </motion.div>

      <AuthGateway isOpen={showAuthGateway} onClose={() => setShowAuthGateway(false)} />
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
      className="bg-surface border border-border rounded-3xl overflow-hidden cursor-pointer group hover:border-teal-500 transition-colors shadow-sm hover:shadow-md"
    >
      {/* Card top gradient */}
      <div className="h-28 bg-gradient-to-br from-background to-teal-500/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] text-teal-600"
          style={{ backgroundImage: "radial-gradient(circle at 30% 70%, currentColor 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        {plans.length > 0 && (
          <div className="absolute top-3 right-3 bg-surface/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium border border-border">
            <BookOpen className="w-3 h-3" /> {plans.length} {plans.length === 1 ? "package" : "packages"}
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Avatar */}
        <div className="relative z-10 w-16 h-16 rounded-2xl border-4 border-surface bg-background flex items-center justify-center text-teal-600 text-2xl font-bold -mt-10 mb-4 shadow-sm shrink-0 overflow-hidden">
          {profile.avatar ? (
            <img src={profile.avatar} alt={coach.name} className="w-full h-full object-cover" />
          ) : (
            coach.name?.[0]?.toUpperCase() || "?"
          )}
        </div>

        <h3 className="text-lg font-semibold text-foreground group-hover:text-teal-600 transition-colors">{coach.name}</h3>

        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
            {specialties.slice(0, 3).map((s, i) => (
              <span key={i} className="text-[11px] bg-background text-muted border border-border px-2.5 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        )}

        {profile.bio ? (
          <p className="text-muted text-xs leading-relaxed line-clamp-2 mb-4">{profile.bio}</p>
        ) : (
          <p className="text-muted text-xs italic mb-4 opacity-70">No bio available yet</p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>{plans.length} package{plans.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1 text-teal-600 text-xs font-semibold group-hover:gap-2 transition-all">
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
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-10 md:pt-12 pb-28 md:pb-24 transition-colors duration-500">
      <header className="mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-teal-500/20 mb-4">
          <Award className="w-3.5 h-3.5" /> Expert Coaches
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-1.5">
          Find Your Coach
        </h1>
        <p className="text-muted text-sm max-w-lg">
          Browse our certified meditation coaches and explore their unique programs.
        </p>
      </header>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border rounded-2xl px-5 py-3 text-sm text-foreground placeholder-muted focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
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
