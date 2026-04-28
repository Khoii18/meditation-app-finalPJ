"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, LogIn } from "lucide-react";
import Link from "next/link";
import { NotificationModal } from "@/components/modals/NotificationModal";
import { motion, AnimatePresence } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function Header() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [incompleteCount, setIncompleteCount] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      try {
        const user = JSON.parse(data);
        if (user.name) setUserName(user.name);
      } catch(e) {}
    }
  }, []);

  const fetchNotifCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/sessions/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIncompleteCount(data.incomplete?.length ?? 0);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifCount]);

  const handleOpenNotif = () => {
    setIsNotifOpen(true);
    setIncompleteCount(0);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="px-4 md:px-6 pt-8 md:pt-10 pb-4 flex justify-between items-center">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-teal-500 mb-1">{greeting}</p>
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground leading-tight">
          {userName ? `Welcome back, ${userName.charAt(0).toUpperCase() + userName.slice(1).split(" ")[0]}` : "Welcome to Lunaria"}
        </h1>
        <p className="text-sm text-muted mt-1">
          {userName ? "Ready for today's session?" : "Sign in to track your journey"}
        </p>
      </div>

      <div className="flex gap-3 items-center">
        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={handleOpenNotif}
            className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-white/5 flex items-center justify-center text-teal-500 hover:bg-teal-100 dark:hover:bg-white/10 transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>

          <AnimatePresence>
            {incompleteCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-rose-500/30 pointer-events-none"
              >
                {incompleteCount > 9 ? "9+" : incompleteCount}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Floating Message Alert */}
          <AnimatePresence>
            {isNotifOpen === false && incompleteCount > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                className="absolute right-full mr-4 top-0 w-64 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-teal-500/20 rounded-2xl shadow-2xl flex items-center gap-3 cursor-pointer group hover:border-teal-500/40 transition-all"
                onClick={handleOpenNotif}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0 shadow-inner">
                  <Bell className="w-5 h-5 text-teal-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-teal-600 uppercase tracking-widest mb-0.5">Session Alert</p>
                  <p className="text-xs text-foreground font-bold truncate leading-tight">You haven't finished your session</p>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full animate-ping" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <NotificationModal
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />

        {userName ? (
          <Link href="./profile" className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-200 hover:bg-teal-600 transition-colors">
            {userName[0].toUpperCase()}
          </Link>
        ) : (
          <Link href="/vi/login" className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-teal-200">
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
