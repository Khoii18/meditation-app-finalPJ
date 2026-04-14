"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Flame, Trophy, Clock, CalendarCheck,
  ShieldCheck, User, ChevronDown, Trash2, X, Activity,
  TrendingUp, Moon, Zap, Target
} from "lucide-react";

const ROLE_STYLES: Record<string, string> = {
  admin:  "bg-violet-500/20 text-violet-300 border-violet-500/30",
  coach:  "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  user:   "bg-slate-500/20 text-slate-300 border-slate-500/20",
};
const ROLE_ICONS: Record<string, any> = {
  admin:  ShieldCheck,
  coach:  Trophy,
  user:   User,
};

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  stats?: {
    currentStreak: number;
    longestStreak: number;
    totalSessions: number;
    mindfulMinutes: number;
    lastCheckInDate: string | null;
  };
}

interface Checkin {
  _id: string;
  date: string;
  sleep: string;
  energy: string;
  goal: string;
}

interface UserDetailProps {
  user: UserData;
  token: string;
  onClose: () => void;
  onRoleChange: (id: string, role: string) => void;
  onDelete: (id: string) => void;
}

function UserDetailModal({ user, token, onClose, onRoleChange, onDelete }: UserDetailProps) {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleDropdown, setRoleDropdown] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${user._id}/checkins`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { setCheckins(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user._id, token]);

  const stats = user.stats || { currentStreak: 0, longestStreak: 0, totalSessions: 0, mindfulMinutes: 0, lastCheckInDate: null };

  const EMOJI_MAP: Record<string, string> = {
    good: "😊", great: "🤩", okay: "😐", tired: "😴", stressed: "😰",
    high: "⚡", medium: "🔋", low: "🪫",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111116] border border-white/10 rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#111116] border-b border-white/5 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
              {user.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">{user.name}</h2>
              <p className="text-slate-400 text-sm">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Current Streak", value: stats.currentStreak, unit: "days", icon: Flame, color: "text-orange-400" },
              { label: "Best Streak",    value: stats.longestStreak, unit: "days", icon: TrendingUp, color: "text-violet-400" },
              { label: "Sessions",       value: stats.totalSessions, unit: "total", icon: Activity, color: "text-indigo-400" },
              { label: "Mindful Min.",   value: stats.mindfulMinutes, unit: "min", icon: Clock, color: "text-emerald-400" },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
                <p className="text-2xl font-bold text-white">{s.value ?? 0}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Last checkin */}
          {stats.lastCheckInDate && (
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 rounded-xl px-4 py-3">
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              Last check-in: <span className="text-white font-medium ml-1">{stats.lastCheckInDate}</span>
            </div>
          )}

          {/* Role management */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold">Role</p>
            <div className="relative inline-block">
              <button
                onClick={() => setRoleDropdown(!roleDropdown)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${ROLE_STYLES[user.role] || ROLE_STYLES.user}`}
              >
                {user.role}
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {roleDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full left-0 mt-1 bg-[#1a1a22] border border-white/10 rounded-xl overflow-hidden shadow-xl z-20 w-36"
                  >
                    {["user", "coach", "admin"].map(r => (
                      <button
                        key={r}
                        onClick={() => { onRoleChange(user._id, r); setRoleDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center gap-2 ${user.role === r ? "text-white font-medium" : "text-slate-400"}`}
                      >
                        {r}
                        {user.role === r && <span className="ml-auto text-violet-400">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Checkin history */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" /> Check-in History (last 30)
            </p>
            {loading ? (
              <div className="text-slate-500 text-sm text-center py-6">Loading...</div>
            ) : checkins.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm bg-white/5 rounded-2xl">
                No check-ins recorded yet
              </div>
            ) : (
              <div className="space-y-2">
                {checkins.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3">
                    <span className="text-xs font-mono text-slate-500 w-24 flex-shrink-0">{c.date}</span>
                    <div className="flex items-center gap-3 flex-1 flex-wrap">
                      {c.sleep && (
                        <span className="flex items-center gap-1 text-xs bg-slate-800 rounded-full px-3 py-1">
                          <Moon className="w-3 h-3 text-indigo-400" />
                          {EMOJI_MAP[c.sleep] || "—"} {c.sleep}
                        </span>
                      )}
                      {c.energy && (
                        <span className="flex items-center gap-1 text-xs bg-slate-800 rounded-full px-3 py-1">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          {EMOJI_MAP[c.energy] || "—"} {c.energy}
                        </span>
                      )}
                      {c.goal && (
                        <span className="flex items-center gap-1 text-xs bg-slate-800 rounded-full px-3 py-1">
                          <Target className="w-3 h-3 text-emerald-400" />
                          {c.goal.length > 30 ? c.goal.slice(0, 30) + "…" : c.goal}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger zone */}
          <div className="border border-rose-500/20 rounded-2xl p-4 bg-rose-500/5">
            <p className="text-xs text-rose-400 font-semibold mb-3 uppercase tracking-widest">Danger Zone</p>
            <button
              onClick={() => { if (confirm(`Delete user "${user.name}"? This cannot be undone.`)) onDelete(user._id); }}
              className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-4 py-2 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" /> Delete this user & all data
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function UsersManagement({ token }: { token: string }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<UserData | null>(null);
  const [filter, setFilter] = useState<"all" | "user" | "coach" | "admin">("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id: string, role: string) => {
    await fetch(`http://localhost:5000/api/users/${id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role }),
    });
    setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));
    setSelected(prev => prev?._id === id ? { ...prev, role } : prev);
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(prev => prev.filter(u => u._id !== id));
    setSelected(null);
  };

  const filtered = filter === "all" ? users : users.filter(u => u.role === filter);

  const roleCount = (r: string) => users.filter(u => u.role === r).length;

  return (
    <>
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: users.length, icon: Users, color: "from-indigo-500 to-violet-500" },
            { label: "Students",    value: roleCount("user"), icon: User, color: "from-slate-600 to-slate-500" },
            { label: "Coaches",     value: roleCount("coach"), icon: Trophy, color: "from-amber-500 to-orange-500" },
            { label: "Admins",      value: roleCount("admin"), icon: ShieldCheck, color: "from-violet-600 to-pink-500" },
          ].map((card, i) => (
            <div key={i} className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-5 border border-slate-100 dark:border-white/5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{card.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "user", "coach", "admin"] as const).map(r => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === r
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10"
              }`}
            >
              {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
              <span className="ml-1.5 text-xs opacity-60">
                {r === "all" ? users.length : roleCount(r)}
              </span>
            </button>
          ))}
        </div>

        {/* Users table */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-500">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500">No users found</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/10">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500">User</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 hidden sm:table-cell">Role</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 hidden md:table-cell">Streak</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 hidden lg:table-cell">Sessions</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 hidden lg:table-cell">Last Check-in</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 text-right">Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const RoleIcon = ROLE_ICONS[u.role] || User;
                  return (
                    <tr key={u._id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center text-sm font-bold text-indigo-400 flex-shrink-0">
                            {u.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium ${ROLE_STYLES[u.role] || ROLE_STYLES.user}`}>
                          <RoleIcon className="w-3 h-3" /> {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{u.stats?.currentStreak ?? 0}d</span>
                          <span className="text-xs text-slate-400">/ best {u.stats?.longestStreak ?? 0}d</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{u.stats?.totalSessions ?? 0}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-xs text-slate-400 font-mono">{u.stats?.lastCheckInDate ?? "—"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelected(u)}
                          className="text-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10 text-xs px-3 py-1.5 rounded-xl transition-all font-medium border border-indigo-500/20"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* User detail modal */}
      <AnimatePresence>
        {selected && (
          <UserDetailModal
            user={selected}
            token={token}
            onClose={() => setSelected(null)}
            onRoleChange={handleRoleChange}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
