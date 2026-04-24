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
  premiumStatus?: {
    isPremium: boolean;
    planType: string;
    startDate: string;
    expiryDate: string;
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
  onGrantPremium: (id: string) => void;
}

function UserDetailModal({ user, token, onClose, onRoleChange, onDelete, onGrantPremium }: UserDetailProps) {
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
          <div className="flex gap-1 px-8 pt-4 border-b border-slate-100">
            {(["stats", "packages"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setDetailTab(t)}
                className={`px-4 py-3 text-[13px] font-bold tracking-wide uppercase transition-colors ${
                  detailTab === t
                    ? "text-teal-600 border-b-2 border-teal-500"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {t === "stats" ? "Stats & History" : `Packages (${coachPlans.length})`}
              </button>
            ))}
          </div>
        )}

        <div className="p-8 space-y-8">
          {/* PACKAGES TAB (Coach only) */}
          {isCoach && detailTab === "packages" ? (
            <div>
              {coachPlans.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-medium text-sm bg-slate-50 border border-slate-100 rounded-3xl">
                  This coach hasn't created any packages yet.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {coachPlans.map((plan: any, i: number) => (
                    <div
                      key={i}
                      className={`relative rounded-3xl p-6 border transition-all ${
                        plan.highlighted
                          ? "bg-gradient-to-br from-teal-50/50 to-emerald-50/50 border-teal-200 shadow-sm"
                          : "bg-white border-slate-100 hover:border-teal-100"
                      }`}
                    >
                      {plan.highlighted && (
                         <span className="absolute -top-3 left-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                           Popular
                         </span>
                      )}
                      <h4 className="text-slate-800 font-bold mb-1.5">{plan.name}</h4>
                      <p className="text-teal-600 font-semibold text-sm mb-4">
                        {plan.price === 0 ? "Free" : `${plan.price} ${plan.currency} / ${plan.period}`}
                      </p>
                      {(plan.features || []).length > 0 && (
                        <ul className="space-y-2">
                          {plan.features.map((f: string, fi: number) => (
                            <li key={fi} className="flex items-start gap-2 text-[13px] text-slate-600 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" /> {f}
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Current Streak", value: stats.currentStreak, unit: "days", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
                  { label: "Best Streak",    value: stats.longestStreak, unit: "days", icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-50" },
                  { label: "Sessions",       value: stats.totalSessions, unit: "total", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-50" },
                  { label: "Mindful Min.",   value: stats.mindfulMinutes, unit: "min", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-50" },
                ].map((s, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center mb-4`}>
                       <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{s.value ?? 0}</p>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Role management & Last Check-in combined row */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-3xl p-5 flex items-center justify-between">
                  <div>
                     <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold">User Role</p>
                     <div className="relative inline-block">
                       <button
                         onClick={() => setRoleDropdown(!roleDropdown)}
                         className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-[13px] font-bold uppercase tracking-wider ${ROLE_STYLES[user.role] || ROLE_STYLES.user}`}
                       >
                         {user.role}
                         <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                       </button>
                       <AnimatePresence>
                         {roleDropdown && (
                           <motion.div
                             initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                             className="absolute top-full left-0 mt-2 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xl z-20 w-40"
                           >
                             {["user", "coach", "admin"].map(r => (
                               <button
                                 key={r}
                                 onClick={() => { onRoleChange(user._id, r); setRoleDropdown(false); }}
                                 className={`w-full text-left px-5 py-3 text-[13px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center gap-2 ${user.role === r ? "text-teal-600 bg-teal-50/50" : "text-slate-500"}`}
                               >
                                 {r}
                                 {user.role === r && <span className="ml-auto text-teal-600">✓</span>}
                               </button>
                             ))}
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                  </div>
                </div>

                {stats.lastCheckInDate && (
                  <div className="flex-1 bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 flex flex-col justify-center">
                    <p className="text-[11px] text-emerald-600/70 uppercase tracking-widest mb-1.5 font-bold">Last Check-in</p>
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                      <CalendarCheck className="w-5 h-5" />
                      {stats.lastCheckInDate}
                    </div>
                  </div>
                )}
              </div>

              {/* Premium Status */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-5 font-bold flex items-center gap-2">
                  <Trophy className="w-4 h-4" /> Subscription Status
                </p>
                {user.premiumStatus?.isPremium ? (
                  <div className="flex items-center gap-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl px-5 py-4">
                    <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-violet-900 font-bold text-sm uppercase tracking-wider">{user.premiumStatus.planType} Plan</p>
                      <p className="text-violet-600/80 text-xs mt-0.5">
                        Active until: {new Date(user.premiumStatus.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 justify-between">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-slate-600 font-bold text-sm">Free User</p>
                        <p className="text-slate-400 text-xs mt-0.5">No active platform subscription.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onGrantPremium(user._id)}
                      className="bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-colors shadow-sm shadow-violet-500/20"
                    >
                      Grant Premium
                    </button>
                  </div>
                )}
              </div>

              {/* Checkin history */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-5 font-bold flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" /> Check-in History (Last 30)
                </p>
                {loading ? (
                  <div className="text-slate-400 font-medium text-sm text-center py-8">Loading records...</div>
                ) : checkins.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 font-medium text-sm bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    No check-ins recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {checkins.map((c, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-slate-100 hover:border-teal-200 transition-colors rounded-2xl px-5 py-4">
                        <span className="text-sm font-semibold text-slate-700 w-28 flex-shrink-0">{c.date}</span>
                        <div className="flex items-center gap-3 flex-1 flex-wrap">
                          {c.sleep && (
                            <span className="flex items-center gap-1.5 text-[12px] font-bold bg-indigo-50 text-indigo-700 rounded-xl px-3 py-1.5 border border-indigo-100">
                              <Moon className="w-3.5 h-3.5" />
                              {EMOJI_MAP[c.sleep] || "—"} <span className="capitalize">{c.sleep}</span>
                            </span>
                          )}
                          {c.energy && (
                            <span className="flex items-center gap-1.5 text-[12px] font-bold bg-amber-50 text-amber-700 rounded-xl px-3 py-1.5 border border-amber-100">
                              <Zap className="w-3.5 h-3.5" />
                              {EMOJI_MAP[c.energy] || "—"} <span className="capitalize">{c.energy}</span>
                            </span>
                          )}
                          {c.goal && (
                            <span className="flex items-center gap-1.5 text-[12px] font-bold bg-teal-50 text-teal-700 rounded-xl px-3 py-1.5 border border-teal-100">
                              <Target className="w-3.5 h-3.5" />
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
              <div className="border border-rose-200 rounded-3xl p-5 bg-rose-50/50 mt-4">
                <p className="text-[11px] text-rose-500 font-bold mb-3 uppercase tracking-widest">Danger Zone</p>
                <button
                  onClick={() => { if (confirm(`Delete user "${user.name}"? This cannot be undone.`)) onDelete(user._id); }}
                  className="flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-white hover:bg-rose-500 px-5 py-2.5 rounded-xl transition-colors border border-rose-200 hover:border-rose-500"
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

  const handleGrantPremium = async (id: string) => {
    if (!confirm("Are you sure you want to manually grant Monthly Premium to this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}/premium`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isPremium: true, planType: "monthly" })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(prev => prev.map(u => u._id === id ? updatedUser : u));
        setSelected(updatedUser);
        alert("Premium granted successfully!");
      }
    } catch (e) {
      console.error(e);
      alert("Error granting premium.");
    }
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
            onGrantPremium={handleGrantPremium}
          />
        )}
      </AnimatePresence>
    </>
  );
}
