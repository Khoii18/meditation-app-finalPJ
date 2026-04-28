"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, Clock, User, RotateCcw, TrendingUp } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function SessionStatsPanel({ token }: { token: string }) {
  const [data, setData] = useState<{ incomplete: any[]; completed: any[] }>({ incomplete: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"incomplete" | "completed">("incomplete");

  useEffect(() => {
    fetch(`${API}/api/sessions/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const formatTime = (secs: number) => {
    if (!secs) return "—";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const pct = (watched: number, total: number) =>
    total > 0 ? Math.round((watched / total) * 100) : 0;

  const list = tab === "incomplete" ? data.incomplete : data.completed;

  return (
    <div className="bg-white rounded-3xl border border-teal-50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Session Tracking</h3>
              <p className="text-xs text-slate-400">User playtime & completion status</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1 rounded-full font-bold text-xs border border-rose-100">
              <RotateCcw className="w-3.5 h-3.5" /> {data.incomplete.length} Incomplete
            </span>
            <span className="flex items-center gap-1.5 bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-bold text-xs border border-teal-100">
              <CheckCircle2 className="w-3.5 h-3.5" /> {data.completed.length} Completed
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTab("incomplete")} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${tab === "incomplete" ? "bg-rose-500 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
            ⚠️ Unfinished ({data.incomplete.length})
          </button>
          <button onClick={() => setTab("completed")} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${tab === "completed" ? "bg-teal-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
            ✅ Completed ({data.completed.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading session data...</div>
        ) : list.length === 0 ? (
          <div className="p-10 text-center">
            <TrendingUp className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No {tab} sessions yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Content</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Watched</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s, i) => (
                <motion.tr
                  key={s._id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 text-xs leading-tight">{s.userId?.name || "Unknown"}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{s.userId?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-slate-700 text-xs max-w-[140px] truncate">{s.contentTitle || s.contentId}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                        <div
                          className={`h-full rounded-full ${tab === "completed" ? "bg-teal-500" : "bg-rose-400"}`}
                          style={{ width: `${pct(s.watchedDuration, s.totalDuration)}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-black ${tab === "completed" ? "text-teal-600" : "text-rose-500"}`}>
                        {pct(s.watchedDuration, s.totalDuration)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(s.watchedDuration)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {s.completed ? (
                      <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full text-[10px] font-black border border-teal-100">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full text-[10px] font-black border border-rose-100">
                        <RotateCcw className="w-3 h-3" /> Paused
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
