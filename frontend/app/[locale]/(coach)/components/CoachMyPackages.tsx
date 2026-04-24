"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, X, Star, CheckCircle2,
  PlayCircle, Music, Video, PlusCircle, Loader2, Save, MoreHorizontal,
  Image as ImageIcon, Sparkles
} from "lucide-react";

interface MeditationPackage {
  _id?: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  exercises?: { title: string; duration: string; audioUrl: string; thumbnail?: string; }[];
  highlighted: boolean;
}

interface PackageFormProps {
  pkg: Partial<MeditationPackage>;
  onChange: (pkg: Partial<MeditationPackage>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

function PackageForm({ pkg, onChange, onSave, onCancel, saving }: PackageFormProps) {
  const [featureInput, setFeatureInput] = useState("");

  const addFeature = () => {
    if (!featureInput.trim()) return;
    onChange({ ...pkg, features: [...(pkg.features || []), featureInput.trim()] });
    setFeatureInput("");
  };

  const removeFeature = (i: number) => {
    onChange({ ...pkg, features: (pkg.features || []).filter((_, fi) => fi !== i) });
  };

  const addExercise = () => {
    onChange({ 
      ...pkg, 
      exercises: [...(pkg.exercises || []), { title: "", duration: "", audioUrl: "", thumbnail: "" }] 
    });
  };

  const updateExercise = (index: number, fields: any) => {
    const newEx = [...(pkg.exercises || [])];
    newEx[index] = { ...newEx[index], ...fields };
    onChange({ ...pkg, exercises: newEx });
  };

  const removeExercise = (index: number) => {
    onChange({ ...pkg, exercises: (pkg.exercises || []).filter((_, i) => i !== index) });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-[#121214] border border-teal-50 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50 dark:border-white/5 shrink-0">
          <div>
            <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">
              {pkg._id ? "Refine Package" : "Create New Path"}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Design a unique journey for your students.</p>
          </div>
          <button onClick={onCancel} className="text-slate-300 hover:text-rose-500 p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
          {/* Basic Info Row */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Package Identity</label>
              <input
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 text-sm text-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                placeholder="e.g. 7-Day Mindful Flow"
                value={pkg.name || ""}
                onChange={(e) => onChange({ ...pkg, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price</label>
                <input
                  type="number"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 text-sm text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={pkg.price ?? 0}
                  onChange={(e) => onChange({ ...pkg, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Interval</label>
                <select
                  className="w-full bg-slate-50 dark:bg-[#121214] border border-slate-100 dark:border-white/10 rounded-2xl px-4 py-4 text-sm text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2rem' }}
                  value={pkg.period || "month"}
                  onChange={(e) => onChange({ ...pkg, period: e.target.value })}
                >
                  <option value="week" className="bg-white dark:bg-[#121214] text-slate-900 dark:text-white">Weekly</option>
                  <option value="month" className="bg-white dark:bg-[#121214] text-slate-900 dark:text-white">Monthly</option>
                  <option value="year" className="bg-white dark:bg-[#121214] text-slate-900 dark:text-white">Yearly</option>
                  <option value="one-time" className="bg-white dark:bg-[#121214] text-slate-900 dark:text-white">Lifetime</option>
                </select>
              </div>
            </div>
          </div>

          {/* Highlights & Features */}
          <div className="space-y-6">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Included Perks</label>
            <div className="flex gap-3">
              <input
                className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 text-sm text-slate-700 dark:text-white placeholder-slate-400 focus:outline-none"
                placeholder="e.g. Personalized 1-on-1 session"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <button onClick={addFeature} className="px-6 bg-slate-900 dark:bg-teal-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {pkg.features?.map((f, i) => (
                <span key={i} className="px-4 py-2 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded-xl text-xs font-bold border border-teal-100 dark:border-teal-500/20 flex items-center gap-2">
                  {f}
                  <button onClick={() => removeFeature(i)} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="space-y-6 pt-4 border-t border-slate-50 dark:border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Academy Curriculum</label>
              <button onClick={addExercise} className="text-teal-600 text-xs font-bold flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <PlusCircle className="w-4 h-4" /> Add Lesson
              </button>
            </div>

            <div className="space-y-6">
              {pkg.exercises?.map((ex, i) => (
                <div key={i} className="group p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 relative space-y-6 transition-all hover:border-teal-200">
                  <button onClick={() => removeExercise(i)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <input
                        className="w-full bg-white dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-white placeholder-slate-400 focus:outline-none"
                        placeholder="Session Title (e.g. Morning Zen Meditation)"
                        value={ex.title}
                        onChange={(e) => updateExercise(i, { title: e.target.value })}
                      />
                    </div>
                    <input
                      className="w-full bg-white dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-white placeholder-slate-400 focus:outline-none"
                      placeholder="Duration (15 min)"
                      value={ex.duration}
                      onChange={(e) => updateExercise(i, { duration: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 ml-1">Media Source (Audio/Video)</p>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <input
                          className="w-full bg-white dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 dark:text-white placeholder-slate-400 focus:outline-none"
                          placeholder="MP4 or MP3 URL"
                          value={ex.audioUrl}
                          onChange={(e) => updateExercise(i, { audioUrl: e.target.value })}
                        />
                        <PlayCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      </div>
                      <label className="shrink-0 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-xl px-4 py-2.5 cursor-pointer flex items-center justify-center transition-all text-xs font-bold border border-slate-300 dark:border-white/10">
                        Upload
                        <input 
                          type="file" 
                          accept="video/*,audio/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            updateExercise(i, { audioUrl: "Uploading..." });
                            try {
                              const sigRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cloudinary-signature`);
                              const { timestamp, signature, folder, cloudName, apiKey } = await sigRes.json();
                              const formData = new FormData();
                              formData.append("file", file);
                              formData.append("api_key", apiKey);
                              formData.append("timestamp", timestamp);
                              formData.append("signature", signature);
                              formData.append("folder", folder);
                              const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                                method: "POST",
                                body: formData,
                              });
                              const data = await res.json();
                              if (data.secure_url) updateExercise(i, { audioUrl: data.secure_url });
                              else updateExercise(i, { audioUrl: "" });
                            } catch (err) { updateExercise(i, { audioUrl: "" }); }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 ml-1">Thumbnail / Background (Required for Audio)</p>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <input
                            className="w-full bg-white dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 dark:text-white placeholder-slate-400 focus:outline-none"
                            placeholder="Image URL (JPG/PNG)"
                            value={ex.thumbnail || ""}
                            onChange={(e) => updateExercise(i, { thumbnail: e.target.value })}
                          />
                          <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        </div>
                        <label className="shrink-0 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-xl px-4 py-2.5 cursor-pointer flex items-center justify-center transition-all text-xs font-bold border border-slate-300 dark:border-white/10">
                          Upload Image
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              updateExercise(i, { thumbnail: "Uploading..." });
                              try {
                                const sigRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cloudinary-signature`);
                                const { timestamp, signature, folder, cloudName, apiKey } = await sigRes.json();
                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("api_key", apiKey);
                                formData.append("timestamp", timestamp);
                                formData.append("signature", signature);
                                formData.append("folder", folder);
                                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                                  method: "POST",
                                  body: formData,
                                });
                                const data = await res.json();
                                if (data.secure_url) updateExercise(i, { thumbnail: data.secure_url });
                                else updateExercise(i, { thumbnail: "" });
                              } catch (err) { updateExercise(i, { thumbnail: "" }); }
                            }}
                          />
                        </label>
                      </div>
                      
                      {/* Image Preview */}
                      {ex.thumbnail && ex.thumbnail !== "Uploading..." && (
                        <div className="ml-1 w-20 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/20">
                          <img src={ex.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {!pkg.exercises?.length && (
                <div className="text-center py-10 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 text-slate-400 text-xs italic">
                  No lessons added to this path yet.
                </div>
              )}
            </div>
          </div>

          <label className="flex items-center gap-4 cursor-pointer pt-6 border-t border-slate-50 dark:border-white/5">
            <div
              onClick={() => onChange({ ...pkg, highlighted: !pkg.highlighted })}
              className={`w-12 h-7 rounded-full transition-all relative ${pkg.highlighted ? "bg-teal-500" : "bg-slate-200 dark:bg-white/10"}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${pkg.highlighted ? "left-6" : "left-1"}`} />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Feature this package as "Most Popular"</span>
          </label>
        </div>

        {/* Footer */}
        <div className="p-8 px-10 border-t border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex gap-4">
          <button onClick={onCancel} className="flex-1 py-4 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-all">Discard</button>
          <button 
            onClick={onSave}
            disabled={saving || !pkg.name}
            className="flex-1 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Confirm Package
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CoachMyPackages({ token }: { token: string }) {
  const [plans, setPlans] = useState<MeditationPackage[]>([]);
  const [editing, setEditing] = useState<Partial<MeditationPackage> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlans(data.coachProfile?.plans || []);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const savePlans = async (newPlans: MeditationPackage[]) => {
    setSaving(true);
    try {
      const plansToSave = newPlans.map(p => {
        if (p._id && p._id.length < 20) {
          const { _id, ...rest } = p;
          return rest;
        }
        return p;
      });

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/me/coach-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plans: plansToSave }),
      });
      fetchPlans();
    } catch (e) {}
    setSaving(false);
  };

  const handleSave = async () => {
    if (!editing?.name) return;
    setSaving(true);
    let newPlans: MeditationPackage[];
    if (editing._id) {
      newPlans = plans.map((p) => (p._id === editing._id ? { ...p, ...editing } as MeditationPackage : p));
    } else {
      const newPkg: MeditationPackage = {
        _id: Date.now().toString(),
        name: editing.name || "",
        price: editing.price ?? 0,
        currency: editing.currency || "USD",
        period: editing.period || "month",
        features: editing.features || [],
        exercises: editing.exercises || [],
        highlighted: editing.highlighted || false,
      };
      newPlans = [...plans, newPkg];
    }
    await savePlans(newPlans);
    setEditing(null);
    setSaving(false);
  };

  if (loading) return <div className="py-24 flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white dark:bg-[#121214] border border-teal-50 dark:border-white/5 p-8 rounded-[2rem] shadow-sm">
        <div>
          <h3 className="text-xl font-serif font-bold text-slate-800 dark:text-white">Active Academy Paths</h3>
          <p className="text-sm text-slate-400 font-medium">You have {plans.length} curated packages for your students.</p>
        </div>
        <button
          onClick={() => setEditing({ name: "", price: 0, currency: "USD", period: "month", features: [], exercises: [], highlighted: false })}
          className="bg-slate-900 dark:bg-teal-600 hover:opacity-90 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-teal-500/10 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Design Path
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <motion.div
            layout
            key={plan._id}
            className={`group relative rounded-[3rem] p-10 border transition-all duration-500 hover:shadow-2xl ${
              plan.highlighted
                ? "bg-gradient-to-br from-teal-500/[0.08] via-white to-white dark:from-teal-500/[0.12] dark:via-[#121214] dark:to-[#121214] border-teal-500/20 shadow-[0_20px_50px_-20px_rgba(20,184,166,0.15)]"
                : "bg-white dark:bg-[#121214] border-slate-100 dark:border-white/5 shadow-sm"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2 bg-slate-900 dark:bg-teal-600 text-white rounded-full shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] z-10 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Signature Path</span>
              </div>
            )}

            <div className="flex items-start justify-between mb-8">
              <div>
                <h4 className="text-2xl font-serif font-bold text-slate-800 dark:text-white mb-1">{plan.name}</h4>
                <div className="flex items-baseline gap-1.5">
                   <span className="text-xl font-bold text-teal-600">${plan.price}</span>
                   <span className="text-xs text-slate-400 font-medium lowercase">/ {plan.period}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing({ ...plan })} className="p-3 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-2xl transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => plan._id && savePlans(plans.filter(p => p._id !== plan._id))} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Included Perks</p>
                 <div className="flex flex-wrap gap-2">
                   {plan.features.map((f, i) => (
                     <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-xl text-[11px] font-bold border border-slate-100 dark:border-white/5">
                        {f}
                     </span>
                   ))}
                 </div>
              </div>

              {plan.exercises && plan.exercises.length > 0 && (
                <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-3">
                   <div className="flex items-center justify-between">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Academy Curriculum</p>
                     <span className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-500/10 px-2.5 py-0.5 rounded-full">{plan.exercises.length} Sessions</span>
                   </div>
                   <div className="grid gap-2">
                     {plan.exercises.slice(0, 3).map((ex, i) => (
                       <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-2xl text-[13px] font-medium text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-3 truncate">
                             <PlayCircle className="w-4 h-4 text-slate-300" />
                             <span className="truncate">{ex.title}</span>
                          </span>
                          <span className="text-[11px] text-slate-400">{ex.duration}</span>
                       </div>
                     ))}
                     {plan.exercises.length > 3 && (
                       <p className="text-[10px] text-center text-slate-300 font-medium pt-1">+{plan.exercises.length - 3} additional lessons in path</p>
                     )}
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {!plans.length && (
           <div className="md:col-span-2 py-20 bg-white dark:bg-[#121214] rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6">
                 <MoreHorizontal className="w-8 h-8 text-slate-300" />
              </div>
              <h4 className="text-xl font-serif font-bold text-slate-800 dark:text-white mb-2">No active paths</h4>
              <p className="text-sm text-slate-400 max-w-xs">Start building your academy by designing your first student package.</p>
           </div>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <PackageForm
            pkg={editing}
            onChange={setEditing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
