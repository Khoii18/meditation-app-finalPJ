"use client";

import { ArrowLeft, Moon, Sun, Monitor, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AppearancePage() {
  const router = useRouter();
  const { user, token, refetch } = useAuth();
  const [theme, setTheme] = useState("light");

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || user?.settings?.preferences?.theme || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, [user]);

  const applyTheme = (newTheme: string) => {
    const isDark = newTheme === "dark" || (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);

    try {
      if (token) {
        await fetch("http://localhost:5000/api/users/me/settings-ui", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            preferences: { theme: newTheme }
          })
        });
        refetch();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const themes = [
    { 
      id: "light", 
      name: "Light", 
      icon: <Sun className="w-6 h-6" />, 
      desc: "Bright & Clean",
      previewColor: "bg-slate-50",
      accentColor: "bg-indigo-600"
    },
    { 
      id: "dark", 
      name: "Dark", 
      icon: <Moon className="w-6 h-6" />, 
      desc: "Midnight Zen",
      previewColor: "bg-slate-900",
      accentColor: "bg-indigo-400"
    },
    { 
      id: "system", 
      name: "System", 
      icon: <Monitor className="w-6 h-6" />, 
      desc: "Auto Adaptive",
      previewColor: "bg-gradient-to-br from-slate-50 to-slate-900",
      accentColor: "bg-teal-500"
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-12 pb-24">
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-3 text-muted hover:text-foreground transition-all font-medium group"
        >
          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-surface transition-colors">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </div>
          Back to Profile
        </button>
      </div>

      <header className="mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4">Appearance</h1>
        <p className="text-lg text-muted max-w-xl leading-relaxed">
          Select a theme that best suits your current surroundings and helps you stay focused on your journey.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => handleThemeChange(t.id)}
            className="group relative flex flex-col items-center outline-none"
          >
            {/* Visual Preview Card */}
            <div className={`relative w-full aspect-[4/5] rounded-[2.5rem] mb-6 overflow-hidden border-2 transition-all duration-500 ${
              theme === t.id 
                ? "border-teal-500 shadow-2xl shadow-teal-500/10 scale-[1.02]" 
                : "border-transparent bg-slate-100 dark:bg-white/5 hover:border-slate-200 dark:hover:border-white/10"
            }`}>
              {/* Mock UI in the preview */}
              <div className={`absolute inset-0 p-6 flex flex-col gap-3 ${t.previewColor}`}>
                <div className="w-1/2 h-3 rounded-full bg-slate-300/30 mb-2" />
                <div className="w-full h-20 rounded-2xl bg-white/10 border border-white/5" />
                <div className="grid grid-cols-2 gap-2 mt-auto">
                   <div className={`h-10 rounded-xl ${t.accentColor} opacity-80`} />
                   <div className="h-10 rounded-xl bg-slate-400/20" />
                </div>
              </div>

              {/* Selection Overlay */}
              <AnimatePresence>
                {theme === t.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-teal-500/10 flex items-center justify-center backdrop-blur-[2px]"
                  >
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <Check className="w-8 h-8 text-teal-600" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Icon floating */}
              <div className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                theme === t.id ? "bg-white text-teal-600 shadow-lg" : "bg-white/20 text-white/60"
              }`}>
                {t.icon}
              </div>
            </div>

            {/* Label */}
            <div className="text-center">
              <h3 className={`text-xl font-bold mb-1 transition-colors ${
                theme === t.id ? "text-foreground" : "text-muted opacity-50"
              }`}>{t.name}</h3>
              <p className={`text-sm transition-colors ${
                theme === t.id ? "text-muted" : "text-muted/40"
              }`}>{t.desc}</p>
            </div>

            {/* Active Glow */}
            {theme === t.id && (
              <motion.div 
                layoutId="activeGlow"
                className="absolute -inset-4 rounded-[3rem] border-2 border-teal-500/20 -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
