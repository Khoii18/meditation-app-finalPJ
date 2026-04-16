"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, UserCircle, Sparkles, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";

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
      const res = await fetch("http://localhost:5000/api/users/me", {
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

      await fetch("http://localhost:5000/api/users/me/coach-profile", {
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
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-[#1C1C1E] border border-white/5 rounded-3xl p-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <UserCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Public Profile</h2>
          <p className="text-slate-400 text-sm">Update how users see you in the Coach Directory</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Avatar URL
          </label>
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-black/30 border border-white/10 shrink-0 flex items-center justify-center text-slate-500 overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-8 h-8 opacity-50" />
              )}
            </div>
            <input
              className="flex-1 bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
              placeholder="https://example.com/my-photo.jpg"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Specialties
          </label>
          <input
            className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            placeholder="e.g. Mindfulness, Anxiety Relief, Sleep"
            value={specialtiesStr}
            onChange={(e) => setSpecialtiesStr(e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-2 ml-1">Separate tags with commas</p>
        </div>

        <div>
          <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
            Intro Video URL (Optional)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              className="flex-1 bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
              placeholder="Paste public MP4 or YouTube video URL"
              value={introVideo}
              onChange={(e) => setIntroVideo(e.target.value)}
            />
            <label className="shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-2xl px-5 py-4 cursor-pointer flex items-center justify-center transition-colors text-sm font-medium border border-white/10">
              Upload Local
              <input 
                type="file" 
                accept="video/*,audio/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  setIntroVideo("Uploading to Cloud... please wait");
                  
                  try {
                    // Yêu cầu chữ ký bảo mật từ Backend
                    const sigRes = await fetch("http://localhost:5000/api/cloudinary-signature");
                    const { timestamp, signature, folder, cloudName, apiKey } = await sigRes.json();

                    if (!signature) throw new Error("Could not get signature. Did you configure Cloudinary Keys in server/.env?");

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("api_key", apiKey);
                    formData.append("timestamp", timestamp);
                    formData.append("signature", signature);
                    formData.append("folder", folder);

                    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
                      method: "POST",
                      body: formData
                    });

                    const data = await res.json();
                    if (data.secure_url) {
                      setIntroVideo(data.secure_url);
                    } else {
                      setIntroVideo("");
                      alert("Cloudinary Error: " + (data.error?.message || "Unknown error"));
                    }
                  } catch (err: any) {
                    alert("Upload failed: " + err.message);
                    setIntroVideo("");
                  }
                }}
              />
            </label>
          </div>
          {introVideo && (
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
              {renderVideoPlayer(introVideo)}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
            Bio / About Me
          </label>
          <textarea
            className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors h-32 resize-none"
            placeholder="Tell your future students about your background, your philosophy, and what they can expect from your packages..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-end">
          <p className={`mr-4 text-emerald-400 text-sm flex items-center gap-1.5 transition-opacity duration-300 ${saved ? "opacity-100" : "opacity-0"}`}>
            <CheckCircle2 className="w-4 h-4" /> Saved successfully
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}
