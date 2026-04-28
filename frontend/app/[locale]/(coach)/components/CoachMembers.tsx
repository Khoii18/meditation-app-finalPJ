"use client";

import { useState, useEffect } from "react";
import { Users, Mail, TrendingUp, Calendar, ShieldCheck, User } from "lucide-react";
import { motion } from "framer-motion";

interface Member {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    stats?: {
      currentStreak: number;
      totalSessions: number;
    };
  };
  planName: string;
  status: string;
  startDate: string;
}

export function CoachMembers({ token }: { token: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/subscriptions/my-members/list`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch (err) {
        console.error("Failed to fetch members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p>Loading your students...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-teal-100/50">
        <Users className="w-16 h-16 text-teal-200 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-bold text-slate-800">No students yet</h3>
        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
          When users subscribe to your packages, they will appear here for you to manage.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Connected Souls</p>
              <h4 className="text-2xl font-bold text-slate-800">{members.length}</h4>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Pathfinders</p>
              <h4 className="text-2xl font-bold text-slate-800">
                {members.filter(m => m.status === "active").length}
              </h4>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Zen Mastery</p>
              <h4 className="text-2xl font-bold text-slate-800">
                {Math.max(...members.map(m => m.userId?.stats?.currentStreak || 0))} Days
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">The Practitioner</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Chosen Path</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Spiritual Growth</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Awakened On</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Vessel Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.map((member, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={member._id} 
                  className="hover:bg-slate-50/30 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        {member.userId?.avatar && member.userId.avatar !== "" ? (
                          <img src={member.userId.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                          {member.userId?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-400">{member.userId?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                      {member.planName}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-teal-500" />
                      <span className="text-sm font-bold text-slate-700">
                        {member.userId?.stats?.currentStreak || 0}d Streak
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                      {member.userId?.stats?.totalSessions || 0} total sessions
                    </p>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(member.startDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 hover:bg-teal-600 hover:text-white transition-all shadow-sm">
                      Unlocked
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
