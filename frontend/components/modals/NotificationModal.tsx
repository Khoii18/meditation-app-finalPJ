"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Sparkles, MessageCircle, Info, RotateCcw, CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { user, token, refetch } = useAuth();

  const [settings, setSettings] = useState({
    dailyReminders: true,
    newContent: true,
    messages: true
  });
  const [sessionNotifs, setSessionNotifs] = useState<{ incomplete: any[]; recentCompleted: any[] }>({ incomplete: [], recentCompleted: [] });

  useEffect(() => {
    if (user?.settings?.notifications) {
      const notifs = user.settings.notifications;
      setSettings({
        dailyReminders: notifs.dailyReminders ?? true,
        newContent: notifs.newContent ?? true,
        messages: notifs.messages ?? true
      });
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen || !token) return;
    fetch(`${API}/api/sessions/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSessionNotifs(data); })
      .catch(() => {});
  }, [isOpen, token]);

  const toggle = async (key: keyof typeof settings) => {
    const newVal = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newVal }));
    try {
      await fetch(`${API}/api/users/me/settings-ui`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ notifications: { [key]: newVal } })
      });
      refetch();
    } catch (err) { console.error(err); }
  };

  const groups = [
    { title: "Personal", items: [
      { id: "dailyReminders", name: "Session Alerts", icon: <Bell className="w-4 h-4 text-teal-500" />, desc: "Reminders for your plan." },
      { id: "messages", name: "Direct Messages", icon: <MessageCircle className="w-4 h-4 text-indigo-500" />, desc: "Replies from Coach/Admin." },
    ]},
    { title: "Discover", items: [
      { id: "newContent", name: "New Content", icon: <Sparkles className="w-4 h-4 text-amber-500" />, desc: "New stories & meditation paths." },
    ]}
  ];

  const hasSessionNotifs = sessionNotifs.incomplete.length > 0 || sessionNotifs.recentCompleted.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-start justify-end p-4 md:p-8 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-sm bg-surface border border-border rounded-3xl shadow-2xl pointer-events-auto overflow-hidden mt-16 md:mt-0"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-serif font-medium text-lg text-foreground">
                Notifications
                {(sessionNotifs.incomplete.length > 0) && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black rounded-full bg-rose-500 text-white">{sessionNotifs.incomplete.length}</span>
                )}
              </h3>
              <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">

              {hasSessionNotifs && (
                <div className="space-y-6">
                  {sessionNotifs.incomplete.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3 px-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Unfinished Sessions</h4>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                      </div>
                      <div className="space-y-2.5">
                        {sessionNotifs.incomplete.map((s, i) => (
                          <Link key={i} href={`./play/${s.contentId}?startAt=${s.watchedDuration}`} onClick={onClose} className="flex items-start gap-3.5 p-4 rounded-3xl bg-rose-500/[0.03] border border-rose-500/10 hover:bg-rose-500/[0.06] hover:border-rose-500/20 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0 shadow-inner">
                              <RotateCcw className="w-5 h-5 text-rose-500" />
                            </div>
                            <div className="min-w-0 relative z-10">
                              <p className="text-[13px] font-bold text-foreground leading-tight truncate mb-1">Continue: {s.contentTitle || "Session"}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-rose-500/10 rounded-full overflow-hidden w-24">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(s.watchedDuration / (s.totalDuration || 1)) * 100}%` }}
                                    className="h-full bg-rose-500" 
                                  />
                                </div>
                                <span className="text-[10px] text-muted font-bold whitespace-nowrap">
                                  {Math.round((s.watchedDuration / (s.totalDuration || 1)) * 100)}%
                                </span>
                              </div>
                              <p className="text-[10px] text-rose-500/70 font-black uppercase tracking-wider mt-2.5 flex items-center gap-1">Resume now <span className="text-xs">→</span></p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {sessionNotifs.recentCompleted.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600/60 mb-3 px-2">Recently Completed</h4>
                      <div className="space-y-2.5">
                        {sessionNotifs.recentCompleted.map((s, i) => (
                          <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-3xl bg-teal-500/[0.03] border border-teal-500/5">
                            <div className="w-9 h-9 rounded-2xl bg-teal-500/10 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-5 h-5 text-teal-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-bold text-foreground leading-tight truncate">{s.contentTitle || "Session"}</p>
                              <p className="text-[10px] text-muted font-medium mt-0.5 flex items-center gap-1.5">
                                <Clock className="w-3 h-3 opacity-50" />
                                {Math.floor(s.watchedDuration / 60)}m · Achievement Unlocked
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="h-px bg-border/50 mx-2" />
                </div>
              )}

              {groups.map((group, idx) => (
                <div key={idx}>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 px-2 opacity-60">{group.title}</h4>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-background transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center border border-border">{item.icon}</div>
                          <div>
                            <h5 className="text-sm font-semibold text-foreground leading-tight">{item.name}</h5>
                            <p className="text-[11px] text-muted">{item.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggle(item.id as keyof typeof settings)}
                          className={`w-10 h-5 rounded-full p-1 transition-all relative ${settings[item.id as keyof typeof settings] ? "bg-indigo-600 shadow-md shadow-indigo-500/20" : "bg-background border border-border"}`}
                        >
                          <motion.div
                            animate={{ x: settings[item.id as keyof typeof settings] ? 20 : 0 }}
                            className={`w-3 h-3 rounded-full ${settings[item.id as keyof typeof settings] ? "bg-white" : "bg-muted"}`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-background border-t border-border">
              <p className="text-[10px] text-center text-muted italic">Settings are synced to your account.</p>
            </div>
          </motion.div>

          <div className="fixed inset-0 -z-10 pointer-events-auto" onClick={onClose} />
        </div>
      )}
    </AnimatePresence>
  );
}
