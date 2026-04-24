"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, UserCircle, Sparkles, Image as ImageIcon, Loader2, CheckCircle2, Video, Link as LinkIcon, Info } from "lucide-react";

interface CoachProfileEditorProps {
  token: string;
}

export function CoachProfileEditor({ token }: CoachProfileEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [bio, setBio] = useState("");
  const [specialtiesStr, setSpecialtiesStr] = useState("");
  const [avatar, setAvatar] = useState("");
  const [introVideo, setIntroVideo] = useState("");

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
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0 bg-black"
          />
        );
      }
    }
    return (
      <video src={url} controls className="w-full h-full object-cover bg-black" />
    );
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.coachProfile) {
        setBio(data.coachProfile.bio || "");
        setSpecialtiesStr((data.coachProfile.specialties || []).join(", "));
        setAvatar(data.coachProfile.avatar || "");
        setIntroVideo(data.coachProfile.introVideo || "");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const specialties = specialtiesStr
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/me/coach-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio, specialties, avatar, introVideo }),
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-10 pb-20"
    >
      {/* 1. Header Card */}
      <div className="bg-white dark:bg-[#121214] border border-teal-50 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group shrink-0">
             <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border-4 border-white dark:border-[#1a1b1e] shadow-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-500">
               {avatar && avatar !== "Uploading..." ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : avatar === "Uploading..." ? (
                  <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                ) : (
                  <UserCircle className="w-16 h-16 text-slate-200" />
                )}
             </div>
             <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all hover:scale-110 border-2 border-white dark:border-[#1a1b1e]">
               <ImageIcon className="w-4 h-4" />
               <input 
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setAvatar("Uploading...");
                    try {
                      const sigRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cloudinary-signature`);
                      const { timestamp, signature, folder, cloudName, apiKey } = await sigRes.json();
                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("api_key", apiKey);
                      formData.append("timestamp", timestamp);
                      formData.append("signature", signature);
                      formData.append("folder", folder);
                      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                        method: "POST",
                        body: formData
                      });
                      const data = await res.json();
                      if (data.secure_url) setAvatar(data.secure_url);
                      else setAvatar("");
                    } catch (err) { setAvatar(""); }
                  }}
                />
             </label>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white">Public Persona</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Craft a presence that resonates with your students.</p>
            <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                 <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Profile Visibility: Public
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                 <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Certified Guide
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Sections */}
      <div className="grid gap-8">
        {/* Specialties & Bio Card */}
        <div className="bg-white dark:bg-[#121214] border border-teal-50 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-10">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-500" /> Core Specialties
            </label>
            <input
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-5 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
              placeholder="e.g. Mindfulness, Anxiety Relief, Deep Sleep"
              value={specialtiesStr}
              onChange={(e) => setSpecialtiesStr(e.target.value)}
            />
            <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1.5 ml-1">
              <Info className="w-3 h-3" /> Separate tags with commas for better indexing
            </p>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-teal-500" /> Teaching Philosophy
            </label>
            <textarea
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-5 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all h-40 resize-none leading-relaxed"
              placeholder="Tell your future students about your background and what they can expect..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Introduction Video Card */}
        <div className="bg-white dark:bg-[#121214] border border-teal-50 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-8">
           <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
                <Video className="w-4 h-4 text-teal-500" /> Video Introduction
              </label>
              <div className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Highly Recommended</div>
           </div>

           <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl pl-12 pr-6 py-5 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    placeholder="YouTube or MP4 Video URL"
                    value={introVideo}
                    onChange={(e) => setIntroVideo(e.target.value)}
                  />
                  <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                </div>
                <label className="shrink-0 bg-slate-900 dark:bg-teal-600 hover:opacity-90 text-white rounded-2xl px-8 py-5 cursor-pointer flex items-center justify-center transition-all text-sm font-bold shadow-lg shadow-teal-500/10">
                  Upload Video
                  <input 
                    type="file" 
                    accept="video/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIntroVideo("Uploading... please stay on this page");
                      try {
                        const sigRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cloudinary-signature`);
                        const { timestamp, signature, folder, cloudName, apiKey } = await sigRes.json();
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("api_key", apiKey);
                        formData.append("timestamp", timestamp);
                        formData.append("signature", signature);
                        formData.append("folder", folder);
                        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                          method: "POST",
                          body: formData
                        });
                        const data = await res.json();
                        if (data.secure_url) setIntroVideo(data.secure_url);
                        else setIntroVideo("");
                      } catch (err) { setIntroVideo(""); }
                    }}
                  />
                </label>
              </div>

              {introVideo && introVideo !== "Uploading... please stay on this page" && (
                <div className="rounded-[2rem] overflow-hidden bg-black aspect-video border border-slate-100 dark:border-white/5 shadow-2xl relative group">
                  {renderVideoPlayer(introVideo)}
                </div>
              )}
           </div>
        </div>
      </div>

      {/* 3. Floating Action Bar */}
      <div className="sticky bottom-8 left-0 right-0 z-40 px-4">
         <div className="max-w-md mx-auto bg-white/80 dark:bg-[#121214]/80 backdrop-blur-xl border border-teal-100 dark:border-white/10 rounded-full p-2 flex items-center justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)]">
            <div className="pl-6">
              {saved ? (
                <p className="text-teal-600 text-xs font-bold flex items-center gap-1.5">
                   <CheckCircle2 className="w-4 h-4" /> Profile Saved
                </p>
              ) : (
                <p className="text-slate-400 text-xs font-medium italic">Unsaved changes...</p>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-teal-600 hover:bg-teal-700 text-white h-14 px-8 rounded-full font-bold transition-all flex items-center justify-center gap-2 min-w-[160px] shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Update Profile
            </button>
         </div>
      </div>
    </motion.div>
  );
}
