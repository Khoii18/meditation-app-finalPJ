"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Clock, CheckCircle2, X, ChevronRight,
  Sparkles, Users, Award, BookOpen, Loader2, PlayCircle, Lock, Crown,
  ShieldCheck, Mail, Check, Send
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { AuthGateway } from "@/components/auth/AuthGateway";
import { API_URL } from "@/config";

interface Exercise {
  title: string;
  duration: string;
  audioUrl: string;
  thumbnail?: string;
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
  const { isLoggedIn, user, token, isPaid, purchasedPackageIds, refetch } = useAuth();
  const router = useRouter();
  const [playingMedia, setPlayingMedia] = useState<{ url: string; thumbnail?: string; planName?: string; exTitle?: string } | null>(null);
  const [showAuthGateway, setShowAuthGateway] = useState(false);


  const [messageInput, setMessageInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isPostingReview, setIsPostingReview] = useState(false);
  const [coachReviews, setCoachReviews] = useState<any[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);

  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'vi';

  useEffect(() => {
    fetchReviews();
  }, [coach._id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/coach/${coach._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setCoachReviews(data);
    } catch (e) {
      console.error("Reviews fetch failed", e);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!isLoggedIn) { setShowAuthGateway(true); return; }
    setIsSendingMessage(true);
    try {
      await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverId: coach._id, content: messageInput })
      });
      setMessageInput("");
      alert("Message sent to Coach!");
    } catch (e) {
      console.error("Message send failed", e);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handlePostReview = async () => {
    if (!isLoggedIn) { setShowAuthGateway(true); return; }
    setIsPostingReview(true);
    try {
      await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ coachId: coach._id, rating: userRating, comment: reviewComment })
      });
      setReviewComment("");
      setUserRating(0);
      fetchReviews();
    } catch (e) {
      console.error("Review post failed", e);
    } finally {
      setIsPostingReview(false);
    }
  };

  const handleGetPremium = () => {
    router.push(`/${locale}/pricing`);
  };

  const renderVideoPlayer = (url: string, thumbnail?: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const vid = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop();
      return (
        <iframe 
          src={`https://www.youtube.com/embed/${vid}?autoplay=1`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      );
    }
    return (
      <div className="relative w-full h-full bg-slate-900 overflow-hidden">
        {thumbnail && (
          <div className="absolute inset-0 z-0">
            <img src={thumbnail} alt="Poster" className="w-full h-full object-cover blur-sm opacity-50 scale-110" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <img src={thumbnail} alt="Thumbnail" className="w-auto h-full max-w-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-700" />
            </div>
          </div>
        )}
        <video key={url} src={url} autoPlay controls className="relative z-10 w-full h-full object-contain bg-transparent" />
      </div>
    );
  };

  const profile = coach.coachProfile || {};
  const plans = profile.plans || [];
  const specialties = profile.specialties || [];

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-[#0A0A0B] rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col md:flex-row">
          <div className="w-full md:w-80 h-full bg-slate-50 dark:bg-[#121214] border-r border-slate-100 dark:border-white/5 p-10 flex flex-col items-center text-center">
             <div className="relative group mb-8">
               <img src={profile.avatar} alt={coach.name} className="relative w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white dark:border-[#121214] shadow-2xl" />
               <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full border-4 border-white dark:border-[#121214] flex items-center justify-center">
                 <CheckCircle2 className="w-4 h-4 text-white" />
               </div>
             </div>
             <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">{coach.name}</h2>
             <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">Verified Mentor</span>
             <div className="flex gap-4 mb-10 text-center">
               <div><p className="text-xl font-bold text-slate-900 dark:text-white">{plans.length}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paths</p></div>
               <div className="w-[1px] h-10 bg-slate-200 dark:bg-white/10" />
               <div><p className="text-xl font-bold text-slate-900 dark:text-white">4.9</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</p></div>
             </div>
             <div className="w-full">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Message Coach..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-5 pr-14 text-[10px] font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isSendingMessage || !messageInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900 dark:bg-indigo-500 text-white rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
                  >
                    {isSendingMessage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 font-medium">Coach usually responds within a few hours</p>
             </div>
          </div>

          <div className="flex-1 h-full flex flex-col relative bg-white dark:bg-[#0A0A0B]">
            <button onClick={onClose} className="absolute top-8 right-8 p-3 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-rose-500 z-20"><X className="w-6 h-6" /></button>
            <div className="flex-1 overflow-y-auto p-10 md:p-14 space-y-20 pt-10 custom-scrollbar">
              <section>
                <h3 className="text-3xl font-serif font-medium text-slate-900 dark:text-white mb-10">Curated Packages</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {plans.map((plan, i) => {
                    const isOwned = purchasedPackageIds.includes(plan.name) || isPaid;
                    const canPlay = !plan.highlighted || isOwned;
                    return (
                      <div 
                        key={i} 
                        className={`group/card relative p-10 rounded-[3rem] border transition-all duration-300 ${
                          plan.highlighted 
                            ? "bg-indigo-500/[0.06] border-indigo-500/20 shadow-xl hover:shadow-indigo-500/10" 
                            : "bg-white dark:bg-transparent border-slate-100 dark:border-white/5 shadow-sm hover:border-indigo-500/30"
                        } cursor-pointer`}
                        onClick={() => {
                          if (canPlay && !playingMedia && plan.exercises?.[0]) {
                            setPlayingMedia({ url: plan.exercises[0].audioUrl, thumbnail: plan.exercises[0].thumbnail, planName: plan.name, exTitle: plan.exercises[0].title });
                          } else if (!canPlay) {
                            handleGetPremium();
                          }
                        }}
                      >
                        {plan.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"><Sparkles className="w-3.5 h-3.5" /> Signature Path</div>}
                        <div className="space-y-8">
                          <h4 className="text-2xl font-serif font-medium text-slate-900 dark:text-white group-hover/card:text-indigo-500 transition-colors">{plan.name}</h4>
                          <div className="p-6 rounded-[2rem] bg-white/50 dark:bg-white/5 border border-slate-50 dark:border-white/5" onClick={(e) => e.stopPropagation()}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Curriculum Preview</p>
                            {playingMedia?.planName === plan.name && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden rounded-2xl bg-black border border-white/10 shadow-lg relative group mx-auto max-w-[240px]">
                                <div className="aspect-video relative">{renderVideoPlayer(playingMedia.url, playingMedia.thumbnail)}<button onClick={() => setPlayingMedia(null)} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white z-20 hover:bg-rose-500 transition-colors"><X className="w-3 h-3" /></button></div>
                              </motion.div>
                            )}
                            <div className="space-y-2.5">
                              {plan.exercises?.slice(0, 3).map((ex, ei) => (
                                <button 
                                  key={ei} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    canPlay ? setPlayingMedia({ url: ex.audioUrl, thumbnail: ex.thumbnail, planName: plan.name, exTitle: ex.title }) : handleGetPremium();
                                  }} 
                                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all hover:translate-x-1 ${
                                    playingMedia?.exTitle === ex.title && playingMedia?.planName === plan.name ? "bg-indigo-500/20 text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                                  }`}
                                >
                                  <span className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${playingMedia?.exTitle === ex.title && playingMedia?.planName === plan.name ? "bg-indigo-400" : "bg-indigo-200"}`} />{ex.title}</span>
                                  <div className="flex items-center gap-2">{!canPlay && <Lock className="w-3 h-3 text-slate-300" />}<PlayCircle className={`w-4 h-4 ${playingMedia?.exTitle === ex.title && playingMedia?.planName === plan.name ? "text-indigo-400" : "text-slate-200"}`} /></div>
                                </button>
                              ))}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isOwned) handleGetPremium();
                            }} 
                            className={`w-full py-4.5 rounded-[1.5rem] font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                              !plan.highlighted 
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20" 
                                : isOwned 
                                  ? "bg-slate-50 dark:bg-white/5 text-slate-400" 
                                  : "bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 hover:-translate-y-0.5"
                            }`}
                          >
                            {!plan.highlighted ? <><CheckCircle2 className="w-4 h-4" /> Free Community Access</> : isOwned ? <><ShieldCheck className="w-5 h-5 opacity-50" /> {isPaid ? "Included with Premium" : "Enrolled"}</> : <><Crown className="w-4 h-4" /> Get Premium to Unlock</>}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
              {profile.bio && (
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Philosophy & Bio</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-serif italic">"{profile.bio}"</p>
                </section>
              )}

              <section>
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-serif font-medium text-slate-900 dark:text-white">Community Reviews</h3>
                  <div className="h-[1px] flex-1 mx-10 bg-slate-100 dark:border-white/5" />
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                   <div className="md:col-span-1 space-y-6">
                      <div className="bg-indigo-500/5 rounded-3xl p-8 border border-indigo-500/10">
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-6">Leave a Review</p>
                        
                        <div className="flex gap-2 mb-6">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button 
                              key={star} 
                              onClick={() => setUserRating(star)}
                              className={`transition-all ${userRating >= star ? 'text-amber-400 scale-110' : 'text-slate-300'}`}
                            >
                              <Star className="w-6 h-6 fill-current" />
                            </button>
                          ))}
                        </div>

                        <textarea 
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience..."
                          className="w-full bg-white dark:bg-[#0A0A0B] border border-indigo-100 dark:border-white/10 rounded-2xl p-4 text-sm text-slate-700 dark:text-white min-h-[100px] mb-4 focus:outline-none focus:border-indigo-500 transition-all"
                        />

                        <button 
                          onClick={handlePostReview}
                          disabled={isPostingReview || userRating === 0}
                          className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-colors disabled:opacity-50"
                        >
                          {isPostingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Review"}
                        </button>
                      </div>
                   </div>

                   <div className="md:col-span-2 space-y-6">
                      {isReviewsLoading ? (
                        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-200" /></div>
                      ) : coachReviews.length === 0 ? (
                        <div className="py-20 text-center bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10">
                           <p className="text-slate-400 text-sm">No reviews yet. Be the first to leave one!</p>
                        </div>
                      ) : (
                        coachReviews.map((rev: any, i: number) => (
                          <div key={i} className="p-8 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] shadow-sm flex gap-5">
                             <img 
                               src={rev.userId?.avatar && rev.userId.avatar !== "" ? rev.userId.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.userId?.name || "User")}&background=random&color=fff`} 
                               className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-100 dark:border-white/10" 
                             />
                             <div className="space-y-2 flex-1">
                                <div className="flex justify-between items-center">
                                   <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rev.userId?.name}</h4>
                                   <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-1">
                                   {[...Array(5)].map((_, si) => <Star key={si} className={`w-3 h-3 fill-current ${si < rev.rating ? 'text-amber-400' : 'text-slate-200'}`} />)}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed italic">"{rev.comment}"</p>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showChatModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowChatModal(false)} />
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white dark:bg-[#121214] w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl border border-white/10">
                <button onClick={() => setShowChatModal(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-rose-500"><X className="w-5 h-5" /></button>
                
                <div className="flex items-center gap-5 mb-10">
                  <img src={profile.avatar} className="w-16 h-16 rounded-2xl object-cover" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message {coach.name}</h3>
                    <p className="text-sm text-slate-400">Gửi tin nhắn trực tiếp cho Mentor của bạn</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                    <textarea 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="What would you like to ask about this path?"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-3xl p-6 text-sm text-slate-900 dark:text-white min-h-[180px] focus:outline-none focus:border-indigo-500 transition-all resize-none"
                    />
                  </div>

                  <button 
                    onClick={async () => {
                      await handleSendMessage();
                      setShowChatModal(false);
                    }}
                    disabled={isSendingMessage || !messageInput.trim()}
                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-bold text-sm shadow-2xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-all disabled:opacity-50"
                  >
                    {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send Message
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-medium">Coach usually responds within 24h</p>
                </div>
             </motion.div>
          </div>
        )}

      </AnimatePresence>
      <AuthGateway isOpen={showAuthGateway} onClose={() => setShowAuthGateway(false)} />
    </>
  );
}

function CoachCard({ coach, onClick }: { coach: Coach; onClick: () => void }) {
  const profile = coach.coachProfile || {};
  const specialties = profile.specialties || [];
  const plans = profile.plans || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} onClick={onClick} className="bg-surface border border-border rounded-3xl overflow-hidden cursor-pointer group hover:border-teal-500 transition-all shadow-sm hover:shadow-md h-full flex flex-col">
      <div className="h-28 bg-gradient-to-br from-background to-teal-500/5 relative overflow-hidden">
        <div className="absolute top-3 right-3 bg-surface/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs text-teal-600 font-medium border border-border flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> {plans.length} package{plans.length !== 1 ? "s" : ""}</div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="relative z-10 w-16 h-16 rounded-2xl border-4 border-surface bg-background flex items-center justify-center text-teal-600 text-2xl font-bold -mt-10 mb-4 shadow-sm overflow-hidden">
          {profile.avatar ? <img src={profile.avatar} alt={coach.name} className="w-full h-full object-cover" /> : coach.name?.[0]?.toUpperCase()}
        </div>
        <h3 className="text-lg font-semibold text-foreground group-hover:text-teal-600 transition-colors mb-2">{coach.name}</h3>
        {specialties.length > 0 && <div className="flex flex-wrap gap-1.5 mb-4">{specialties.slice(0, 3).map((s, i) => <span key={i} className="text-[10px] bg-background text-muted border border-border px-2.5 py-0.5 rounded-full font-medium">{s}</span>)}</div>}
        <p className="text-muted text-[11px] leading-relaxed line-clamp-2 mb-4 italic">"{profile.bio || "Zen mentor and mindfulness expert."}"</p>
        <div className="mt-auto flex items-center justify-end text-teal-600 text-[11px] font-bold group-hover:gap-1 transition-all">View Profile <ChevronRight className="w-3 h-3" /></div>
      </div>
    </motion.div>
  );
}

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Coach | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/users/coaches`)
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
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-10 md:pt-12 pb-28 md:pb-24">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-teal-500/20 mb-4"><Award className="w-3.5 h-3.5" /> Expert Coaches</div>
        <h1 className="text-3xl font-serif font-medium text-foreground mb-2">Find Your Mentor</h1>
        <p className="text-muted text-sm max-w-lg">Connect with world-class teachers and unlock specialized signature paths.</p>
      </header>

      <div className="mb-8 relative max-w-md">
        <input type="text" placeholder="Search by name or specialty..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-surface border border-border rounded-2xl px-5 py-3 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /><p className="text-slate-500 text-sm">Loading mentors...</p></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24"><div className="text-5xl mb-4">🧘</div><p className="text-slate-400 text-lg">No mentors found</p></div>
      ) : (
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
          {filtered.map((coach) => <CoachCard key={coach._id} coach={coach} onClick={() => setSelected(coach)} />)}
        </motion.div>
      )}

      <AnimatePresence>
        {selected && <CoachDetailModal coach={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
