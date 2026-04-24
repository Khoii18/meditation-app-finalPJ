"use client";

import { ArrowLeft, Mic2, Volume2, Timer, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function PreferencesPage() {
  const router = useRouter();
  
  const { user, token, refetch } = useAuth();
  
  const [prefs, setPrefs] = useState({
    narratorVoice: "Serena (Calm)",
    ambientVolume: 40,
    defaultDuration: "15m",
  });

  useEffect(() => {
    if (user?.settings?.preferences) {
      setSettingsFromUser(user.settings.preferences);
    }
  }, [user]);

  const setSettingsFromUser = (p: any) => {
    setPrefs({
       narratorVoice: p.narratorVoice || "Serena (Calm)",
       ambientVolume: p.ambientVolume || 40,
       defaultDuration: p.defaultDuration || "15m"
    });
  };

  const updatePref = async (key: keyof typeof prefs, val: any) => {
    setPrefs(prev => ({ ...prev, [key]: val }));

    try {
      await fetch("http://localhost:5000/api/users/me/settings-ui", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          preferences: { [key]: val }
        })
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-12 pb-24">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Back to Profile
      </button>

      <header className="mb-10">
        <h1 className="text-3xl font-serif font-medium text-foreground mb-2">Preferences</h1>
        <p className="text-muted text-sm">Fine-tune your meditation experience.</p>
      </header>

      <div className="space-y-6">
        {/* Voice Selection */}
        <div className="bg-surface rounded-[2.5rem] border border-border p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Narrator Voice</h3>
              <p className="text-xs text-muted">Choose your preferred guide voice.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Serena (Calm)", "Marcus (Steady)", "Luna (Soft)", "Oliver (Deep)"].map((v) => (
              <button 
                key={v}
                onClick={() => updatePref("narratorVoice", v)}
                className={`p-4 rounded-2xl border text-sm font-medium transition-all ${
                  prefs.narratorVoice === v 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                    : "bg-background border-border text-muted hover:border-indigo-500/50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Control */}
        <div className="bg-surface rounded-[2.5rem] border border-border p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Ambient Volume</h3>
              <p className="text-xs text-muted">Background sound intensity: {prefs.ambientVolume}%</p>
            </div>
          </div>
          <input 
            type="range" 
            value={prefs.ambientVolume}
            onChange={(e) => updatePref("ambientVolume", parseInt(e.target.value))}
            className="w-full h-2 bg-background border border-border rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Default Duration */}
        <div className="bg-surface rounded-[2.5rem] border border-border p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Default Duration</h3>
              <p className="text-xs text-slate-500">Preferred session length.</p>
            </div>
          </div>
          <div className="flex gap-3">
            {["5", "10", "15", "20", "30"].map((m) => (
              <button 
                key={m}
                onClick={() => updatePref("defaultDuration", m + "m")}
                className={`flex-1 py-3 rounded-2xl border text-sm font-bold transition-all ${
                  prefs.defaultDuration === (m + "m")
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                    : "bg-background border-border text-muted hover:border-indigo-500/50"
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
