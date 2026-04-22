"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Flame, Trophy, Clock, CalendarCheck,
  ShieldCheck, User, ChevronDown, Trash2, X, Activity,
  TrendingUp, Moon, Zap, Target, CheckCircle2
} from "lucide-react";

const ROLE_STYLES: Record<string, string> = {
  admin:  "bg-teal-50 text-teal-700 border-teal-100",
  coach:  "bg-emerald-50 text-emerald-700 border-emerald-100",
  user:   "bg-slate-50 text-slate-600 border-slate-100",
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
  const [detailTab, setDetailTab] = useState<"stats" | "packages">("stats");

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${user._id}/checkins`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { setCheckins(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user._id, token]);

  const stats = user.stats || { currentStreak: 0, longestStreak: 0, totalSessions: 0, mindfulMinutes: 0, lastCheckInDate: null };
  const coachPlans = (user as any).coachProfile?.plans || [];
  const isCoach = user.role === "coach";

  const EMOJI_MAP: Record<string, string> = {
    good: "😊", great: "🤩", okay: "😐", tired: "😴", stressed: "😰",
    high: "⚡", medium: "🔋", low: "🪫",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-teal-100 rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-teal-50 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              {user.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="font-serif font-bold text-slate-800 text-xl">{user.name}</h2>
              <p className="text-slate-400 text-sm font-medium">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2.5 rounded-2xl hover:bg-slate-50">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs (only if coach) */}
        {isCoach && (
          <div className="flex gap-1 px-6 pt-4 border-b border-white/5">
            {(["stats", "packages"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setDetailTab(t)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  detailTab === t
                    ? "text-indigo-400 border-b-2 border-indigo-500"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t === "stats" ? "Stats & History" : `Packages (${coachPlans.length})`}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* PACKAGES TAB (Coach only) */}
          {isCoach && detailTab === "packages" ? (
            <div>
              {coachPlans.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm bg-white/5 rounded-2xl">
                  This coach hasn't created any packages yet.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {coachPlans.map((plan: any, i: number) => (
                    <div
                      key={i}
                      className={`relative rounded-2xl p-5 border ${
                        plan.highlighted
                          ? "bg-gradient-to-br from-indigo-600/20 to-violet-600/10 border-indigo-500/30"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      {plan.highlighted && (
                        <span className="absolute -top-2.5 left-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                      <h4 className="text-white font-semibold mb-1">{plan.name}</h4>
                      <p className="text-indigo-300 text-sm mb-3">
                        {plan.price === 0 ? "Free" : `${plan.price} ${plan.currency} / ${plan.period}`}
                      </p>
                      {(plan.features || []).length > 0 && (
                        <ul className="space-y-1">
                          {plan.features.map((f: string, fi: number) => (
                            <li key={fi} className="flex items-center gap-2 text-xs text-slate-400">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
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
            <div key={i} className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm">
              {card.color.includes('indigo') && <div className={`w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5 text-teal-600" />
              </div>}
              {!card.color.includes('indigo') && <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color.replace('indigo', 'teal').replace('violet', 'emerald')} flex items-center justify-center mb-3 shadow-sm`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>}
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mt-1">{card.label}</p>
            </div>
          ))}
        </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {(["all", "user", "coach", "admin"] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setFilter(r)}
                  className={`px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                    filter === r
                      ? "bg-teal-600 text-white shadow-sm shadow-teal-500/20"
                      : "bg-white text-slate-400 border border-teal-50 hover:bg-teal-50"
                  }`}
                >
                  {r === "all" ? "All" : r}
                  <span className="ml-2 opacity-60">
                    {r === "all" ? users.length : roleCount(r)}
                  </span>
                </button>
              ))}
            </div>

            {/* Users table */}
            <div className="bg-white rounded-3xl border border-teal-100 overflow-hidden shadow-sm">
              {loading ? (
                <div className="py-24 text-center text-slate-400 font-medium">Loading users...</div>
              ) : filtered.length === 0 ? (
                <div className="py-24 text-center text-slate-400 font-medium">No users found</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-teal-50">
                      <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">User</th>
                      <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hidden sm:table-cell">Role</th>
                      <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hidden md:table-cell">Streak</th>
                      <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hidden lg:table-cell">Sessions</th>
                      <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hidden lg:table-cell">Last Check-in</th>
                      <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u, i) => {
                      const RoleIcon = ROLE_ICONS[u.role] || User;
                      return (
                        <tr key={u._id} className="border-b border-teal-50/50 hover:bg-teal-50/30 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-sm font-bold text-teal-600 flex-shrink-0 border border-teal-100">
                                {u.name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                                <p className="text-[11px] text-slate-400 font-medium">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 hidden sm:table-cell">
                            <span className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl border font-bold ${ROLE_STYLES[u.role] || ROLE_STYLES.user}`}>
                              <RoleIcon className="w-3.5 h-3.5" /> {u.role}
                            </span>
                          </td>
                          <td className="px-8 py-5 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Flame className="w-4 h-4 text-orange-400" />
                              <span className="text-sm font-bold text-slate-700">{u.stats?.currentStreak ?? 0}d</span>
                              <span className="text-[10px] uppercase font-bold text-slate-300">/ best {u.stats?.longestStreak ?? 0}d</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 hidden lg:table-cell">
                            <span className="text-sm font-bold text-slate-600">{u.stats?.totalSessions ?? 0}</span>
                          </td>
                          <td className="px-8 py-5 hidden lg:table-cell">
                            <span className="text-xs text-slate-400 font-mono font-medium">{u.stats?.lastCheckInDate ?? "—"}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button
                              onClick={() => setSelected(u)}
                              className="text-teal-600 hover:bg-teal-50 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-2xl transition-all border border-teal-100"
                            >
                              View Detail
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
