"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smile, Moon, Zap, TrendingUp, Users, CalendarDays, RefreshCw } from "lucide-react";

const MOODS = [
  { label: "Happy",    emoji: "🤩", color: "#f59e0b", bg: "bg-amber-500",    bar: "from-amber-400 to-amber-500" },
  { label: "Peaceful", emoji: "😌", color: "#10b981", bg: "bg-emerald-500",  bar: "from-emerald-400 to-emerald-500" },
  { label: "Neutral",  emoji: "😐", color: "#6b7280", bg: "bg-slate-500",    bar: "from-slate-400 to-slate-500" },
  { label: "Sad",      emoji: "😔", color: "#6366f1", bg: "bg-indigo-500",   bar: "from-indigo-400 to-indigo-500" },
  { label: "Angry",    emoji: "😠", color: "#ef4444", bg: "bg-rose-500",     bar: "from-rose-400 to-rose-500" },
];

const SLEEP_LABELS: Record<string, string> = {
  "Great":            "😴 Great",
  "Tossing & Turning": "😰 Restless",
};
const ENERGY_LABELS: Record<string, string> = {
  "Full of energy":  "⚡ High",
  "A bit sluggish":  "🪫 Low",
};

interface AnalyticsData {
  total: number;
  moodDistribution: Record<string, number>;
  sleepDistribution: Record<string, number>;
  energyDistribution: Record<string, number>;
  recent: Array<{ date: string; mood: string; sleep: string; energy: string; userId?: { name: string } }>;
}

export function EmotionsAnalytics({ token }: { token: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/analytics/mood?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (!data) return <div className="text-slate-500 text-center py-12">Failed to load analytics</div>;

  const totalMoods = Object.values(data.moodDistribution).reduce((a, b) => a + b, 0);
  const totalSleep  = Object.values(data.sleepDistribution).reduce((a, b) => a + b, 0);
  const totalEnergy = Object.values(data.energyDistribution).reduce((a, b) => a + b, 0);

  // Dominant mood
  const dominant = MOODS.reduce((prev, curr) =>
    (data.moodDistribution[curr.label] || 0) > (data.moodDistribution[prev.label] || 0) ? curr : prev
  );
  const positiveRate = totalMoods > 0
    ? Math.round(((data.moodDistribution["Happy"] || 0) + (data.moodDistribution["Peaceful"] || 0)) / totalMoods * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-800">Community Emotions</h2>
          <p className="text-sm text-slate-500 font-medium">{data.total} check-ins in the last {days} days</p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                days === d
                  ? "bg-teal-600 text-white shadow-sm shadow-teal-500/20"
                  : "bg-white text-slate-400 border border-teal-50 hover:bg-teal-50"
              }`}
            >
              {d}d
            </button>
          ))}
          <button onClick={fetchAnalytics} className="p-2 rounded-2xl bg-white border border-teal-50 text-slate-400 hover:bg-teal-50 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Check-ins", value: data.total, icon: CalendarDays, color: "from-teal-500 to-emerald-500" },
          { label: "Positive Rate",   value: `${positiveRate}%`, icon: TrendingUp, color: "from-teal-400 to-teal-500" },
          { label: "Dominant Mood",   value: `${dominant.emoji} ${dominant.label}`, icon: Smile, color: "from-amber-400 to-orange-400" },
          { label: "Moods Recorded",  value: totalMoods, icon: Users, color: "from-rose-400 to-pink-400" },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-sm`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood distribution */}
        <div className="bg-white rounded-3xl p-7 border border-teal-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Smile className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-serif font-bold text-slate-800">Mood Distribution</h3>
          </div>
          <div className="space-y-3">
            {MOODS.map(m => {
              const count = data.moodDistribution[m.label] || 0;
              const pct = totalMoods > 0 ? Math.round((count / totalMoods) * 100) : 0;
              return (
                <div key={m.label} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{m.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                      <span>{m.label}</span>
                      <span className="text-slate-600">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${m.bar}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sleep & Energy */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-7 border border-teal-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-teal-50 rounded-lg">
                <Moon className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-serif font-bold text-slate-800">Sleep Quality</h3>
            </div>
            <div className="flex gap-4">
              {Object.entries(data.sleepDistribution).map(([k, v]) => {
                const pct = totalSleep > 0 ? Math.round((v / totalSleep) * 100) : 0;
                return (
                  <div key={k} className="flex-1 text-center">
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{pct}%</div>
                    <div className="text-xs text-slate-500 mt-1">{SLEEP_LABELS[k] || k}</div>
                    <div className="text-xs text-slate-400">{v} people</div>
                  </div>
                );
              })}
              {totalSleep === 0 && <p className="text-slate-400 text-sm">No data yet</p>}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-teal-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="font-serif font-bold text-slate-800">Energy Level</h3>
            </div>
            <div className="flex gap-4">
              {Object.entries(data.energyDistribution).map(([k, v]) => {
                const pct = totalEnergy > 0 ? Math.round((v / totalEnergy) * 100) : 0;
                return (
                  <div key={k} className="flex-1 text-center">
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{pct}%</div>
                    <div className="text-xs text-slate-500 mt-1">{ENERGY_LABELS[k] || k}</div>
                    <div className="text-xs text-slate-400">{v} people</div>
                  </div>
                );
              })}
              {totalEnergy === 0 && <p className="text-slate-400 text-sm">No data yet</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Recent mood feed */}
      <div className="bg-white rounded-3xl p-7 border border-teal-100 shadow-sm">
        <h3 className="font-serif font-bold text-slate-800 mb-6">Recent Mood Feed</h3>
        {data.recent.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No mood data recorded yet</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {data.recent.map((r, i) => {
              const moodDef = MOODS.find(m => m.label === r.mood);
              return (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 dark:border-white/5 last:border-0">
                  <span className="text-xl">{moodDef?.emoji || "—"}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {r.userId?.name && (
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.userId.name}</span>
                      )}
                      {r.mood && (
                        <span className={`text-xs px-2 py-0.5 rounded-full text-white ${moodDef?.bg || "bg-slate-500"}`}>
                          {r.mood}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 mt-0.5 text-xs text-slate-400">
                      {r.sleep  && <span>💤 {r.sleep}</span>}
                      {r.energy && <span>⚡ {r.energy}</span>}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{r.date}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
