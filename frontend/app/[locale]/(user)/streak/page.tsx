"use client";

import { useState, useEffect } from "react";
import { StreakDisplay } from "./components/StreakDisplay";
import { StreakMetrics } from "./components/StreakMetrics";
import { RecentBadges } from "./components/RecentBadges";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function StreakContent() {
  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
    mindfulMinutes: 0
  });
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.stats) setStats(data.stats);
        if (data.claimedRewards) setClaimedRewards(data.claimedRewards);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors duration-500">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 xl:px-12 pt-8 md:pt-10 pb-28 md:pb-10">
        <header className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-500 mb-1">Your Stats</p>
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground">Meditation Journey</h1>
          <p className="text-muted mt-1 text-sm">Consistency is the key to mindfulness.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8">
          <div className="lg:col-span-2">
            <StreakDisplay currentStreak={stats.currentStreak} />
            <StreakMetrics stats={stats} />
          </div>

          <RecentBadges 
            currentStreak={stats.currentStreak} 
            longestStreak={stats.longestStreak} 
            claimedRewards={claimedRewards} 
            onClaimed={() => fetchUser()}
          />
        </div>
      </div>
    </div>
  );
}

export default function StreakPage() {
  return (
    <ProtectedRoute>
      <StreakContent />
    </ProtectedRoute>
  );
}
