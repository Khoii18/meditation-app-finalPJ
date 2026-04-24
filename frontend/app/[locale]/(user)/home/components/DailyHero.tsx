"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_URL } from "@/config";

export function DailyHero() {
  const [day, setDay] = useState(1);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const userRes = await fetch(`${API_URL}/api/users/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          // Calculate day based on account creation date (max 30 days)
          const created = new Date(userData.createdAt).getTime();
          const now = new Date().getTime();
          const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24)) + 1;
          const currentDay = Math.min(diffDays, 30);
          setDay(currentDay);

          // Fetch admin recommendation for this day
          const recRes = await fetch(`${API_URL}/api/recommendations`);
          if (recRes.ok) {
            const recs = await recRes.json();
            const todayRec = recs.find((r: any) => r.day === currentDay);
            if (todayRec) {
              setSuggestion(todayRec);
            }
          }
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const title = suggestion ? (suggestion.contentId?.title || suggestion.title) : "Starting Your Journey";
  const note = suggestion?.note || "A mindful start to your day.";
  const linkHref = suggestion?.contentId ? `./play/${suggestion.contentId._id}` : "./journey";

  return (
    <section className="w-full">
      <Link href={linkHref} className="block w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full rounded-3xl overflow-hidden cursor-pointer group bg-surface border border-border shadow-sm"
          style={{ aspectRatio: "16/7" }}
        >
          {/* Subtle decorative pattern / shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 right-10 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-teal-500 mb-2">
                Morning Routine • Day {day} of 30
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground">{title}</h2>
              <p className="text-sm text-muted mt-2 max-w-lg italic">"{note}"</p>
            </div>

            <div className="flex items-center gap-3 self-start">
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-300">
                <Play className="w-5 h-5 ml-0.5 fill-teal-500 text-teal-500" />
              </div>
              <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm tracking-wide">Start Session</span>
            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  );
}
