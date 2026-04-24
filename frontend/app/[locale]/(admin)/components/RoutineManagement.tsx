"use client";

import { useState, useEffect } from "react";
import { Calendar, Search, Edit2, Check, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function RoutineManagement({ token }: { token: string }) {
  const [recs, setRecs] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [selectedContentId, setSelectedContentId] = useState("");
  const [note, setNote] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recsRes, contentRes] = await Promise.all([
        fetch("http://localhost:5000/api/recommendations"),
        fetch("http://localhost:5000/api/content")
      ]);
      const recsData = await recsRes.json();
      const contentData = await contentRes.json();
      
      // Ensure all 30 days exist in local state even if not in DB
      const fullRecs = Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        return recsData.find((r: any) => r.day === day) || { day, title: "Not Set", note: "" };
      });
      
      setRecs(fullRecs);
      setContents(contentData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (day: number) => {
    if (!selectedContentId) return;
    try {
      const res = await fetch("http://localhost:5000/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ day, contentId: selectedContentId, note })
      });
      if (res.ok) {
        setEditingDay(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recs.map((rec) => (
          <div key={rec.day} className="bg-white rounded-3xl border border-teal-100 p-5 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
              <span className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold">
                {rec.day}
              </span>
              {editingDay === rec.day ? (
                <div className="flex gap-1">
                  <button onClick={() => handleSave(rec.day)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setEditingDay(null)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setEditingDay(rec.day);
                    setSelectedContentId(rec.contentId?._id || "");
                    setNote(rec.note || "");
                  }}
                  className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {editingDay === rec.day ? (
              <div className="space-y-3">
                <select 
                  value={selectedContentId}
                  onChange={(e) => setSelectedContentId(e.target.value)}
                  className="w-full bg-slate-50 border border-teal-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500"
                >
                  <option value="">Select Content...</option>
                  {contents.map(c => (
                    <option key={c._id} value={c._id}>{c.title} ({c.type})</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note for user..."
                  className="w-full bg-slate-50 border border-teal-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
              </div>
            ) : (
              <div>
                <h4 className="font-serif font-bold text-slate-800 line-clamp-1">{rec.contentId?.title || rec.title}</h4>
                <p className="text-xs text-slate-400 mt-1 italic">"{rec.note || "No note set."}"</p>
                <div className="mt-3 flex items-center gap-2">
                   <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase tracking-widest">
                     {rec.contentId?.type || "Unset"}
                   </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
