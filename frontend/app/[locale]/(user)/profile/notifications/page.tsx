"use client";

import { ArrowLeft, Bell, Sparkles, MessageCircle, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationsPage() {
  const router = useRouter();
  
  const { user, token, refetch } = useAuth();
  
  const [settings, setSettings] = useState({
    dailyReminders: true,
    newContent: true,
    communityActivity: false,
    systemUpdates: true
  });

  useEffect(() => {
    if (user?.settings?.notifications) {
      setSettings(user.settings.notifications);
    }
  }, [user]);

  const toggle = async (key: keyof typeof settings) => {
    const newVal = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newVal }));

    try {
      await fetch("http://localhost:5000/api/users/me/settings-ui", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          notifications: { [key]: newVal }
        })
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const groups = [
    { 
      title: "Meditation Reminders", 
      items: [
        { id: "dailyReminders", name: "Daily Reminders", icon: <Bell className="w-5 h-5 text-indigo-500" />, desc: "Get notified when it's time for your session." },
      ]
    },
    { 
      title: "Content & Updates", 
      items: [
        { id: "newContent", name: "New Content", icon: <Sparkles className="w-5 h-5 text-amber-500" />, desc: "Be the first to know about new sleep stories and paths." },
        { id: "systemUpdates", name: "System Updates", icon: <Info className="w-5 h-5 text-teal-500" />, desc: "Essential news about your account and the app." },
      ]
    },
    { 
      title: "Social", 
      items: [
        { id: "communityActivity", name: "Community Activity", icon: <MessageCircle className="w-5 h-5 text-rose-500" />, desc: "Alerts for shared journeys and instructor comments." },
      ]
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-12 pb-24">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Back to Profile
      </button>

      <header className="mb-10">
        <h1 className="text-3xl font-serif font-medium text-foreground mb-2">Notifications</h1>
        <p className="text-muted text-sm">Manage how and when Lunaria reaches out to you.</p>
      </header>

      <div className="space-y-8">
        {groups.map((group, idx) => (
          <div key={idx}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-4 px-2 opacity-70">{group.title}</h2>
            <div className="bg-surface rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
              {group.items.map((item, i) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-background border border-border flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                        <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggle(item.id as keyof typeof settings)}
                      className={`w-12 h-6 rounded-full p-1 transition-all relative ${
                        settings[item.id as keyof typeof settings] ? "bg-indigo-600 shadow-lg shadow-indigo-500/20" : "bg-background border border-border"
                      }`}
                    >
                      <motion.div 
                        animate={{ x: settings[item.id as keyof typeof settings] ? 24 : 0 }}
                        className={`w-4 h-4 rounded-full shadow-sm ${settings[item.id as keyof typeof settings] ? "bg-white" : "bg-muted"}`} 
                      />
                    </button>
                  </div>
                  {i < group.items.length - 1 && <div className="h-px bg-border mx-6" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
