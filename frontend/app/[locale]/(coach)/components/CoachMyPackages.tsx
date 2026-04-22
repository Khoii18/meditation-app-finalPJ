"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, X, Star, CheckCircle2,
  DollarSign, Tag, List, Sparkles
} from "lucide-react";

interface MeditationPackage {
  _id?: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  exercises?: { title: string; duration: string; audioUrl: string; }[];
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

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        className="w-full max-w-lg bg-white border border-teal-100 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-teal-50 shrink-0">
          <h3 className="text-xl font-serif font-bold text-slate-800">
            {pkg._id ? "Edit Package" : "New Package"}
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Name */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Package Name</label>
            <input
              className="w-full bg-slate-50 border border-teal-50 rounded-2xl px-5 py-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
              placeholder="e.g. Beginner Mindfulness"
              value={pkg.name || ""}
              onChange={(e) => onChange({ ...pkg, name: e.target.value })}
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2 block">Price</label>
              <input
                type="number"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                placeholder="0"
                value={pkg.price ?? 0}
                onChange={(e) => onChange({ ...pkg, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2 block">Currency</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                value={pkg.currency || "USD"}
                onChange={(e) => onChange({ ...pkg, currency: e.target.value })}
              >
                <option value="USD">USD</option>
                <option value="VND">VND</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2 block">Period</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                value={pkg.period || "month"}
                onChange={(e) => onChange({ ...pkg, period: e.target.value })}
              >
                <option value="month">month</option>
                <option value="year">year</option>
                <option value="week">week</option>
                <option value="one-time">one-time</option>
              </select>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2 block">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                placeholder="Add a feature and press Enter"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <button
                onClick={addFeature}
                className="px-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {(pkg.features || []).length > 0 && (
              <ul className="space-y-1.5">
                {(pkg.features || []).map((f, i) => (
                  <li key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="flex-1">{f}</span>
                    <button onClick={() => removeFeature(i)} className="text-slate-500 hover:text-rose-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Exercises */}
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2 flex items-center justify-between">
              <span>Private Exercises</span>
              <button 
                type="button"
                onClick={() => onChange({ ...pkg, exercises: [...(pkg.exercises || []), { title: "", duration: "", audioUrl: "" }] })}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 normal-case tracking-normal"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </label>
            {(pkg.exercises || []).length > 0 ? (
              <div className="space-y-3">
                {(pkg.exercises || []).map((ex, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 relative">
                    <button 
                      type="button"
                      onClick={() => onChange({ ...pkg, exercises: (pkg.exercises || []).filter((_, exI) => exI !== i) })}
                      className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="grid grid-cols-2 gap-2 mb-2 pr-6">
                      <input 
                        className="bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 w-full"
                        placeholder="Exercise Title"
                        value={ex.title}
                        onChange={(e) => {
                          const newEx = [...(pkg.exercises || [])];
                          newEx[i].title = e.target.value;
                          onChange({ ...pkg, exercises: newEx });
                        }}
                      />
                      <input 
                        className="bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 w-full"
                        placeholder="Duration (e.g. 10 min)"
                        value={ex.duration}
                        onChange={(e) => {
                          const newEx = [...(pkg.exercises || [])];
                          newEx[i].duration = e.target.value;
                          onChange({ ...pkg, exercises: newEx });
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                        placeholder="Audio/Video URL or Upload File"
                        value={ex.audioUrl}
                        onChange={(e) => {
                          const newEx = [...(pkg.exercises || [])];
                          newEx[i].audioUrl = e.target.value;
                          onChange({ ...pkg, exercises: newEx });
                        }}
                      />
                      <label className="shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-2 cursor-pointer flex items-center justify-center transition-colors text-xs font-medium border border-white/10">
                        Upload Local
                        <input 
                          type="file" 
                          accept="video/*,audio/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            const newEx = [...(pkg.exercises || [])];
                            newEx[i].audioUrl = "Uploading...";
                            onChange({ ...pkg, exercises: newEx });
                            
                            try {
                              // Yêu cầu chữ ký bảo mật từ Backend
                              const sigRes = await fetch("http://localhost:5000/api/cloudinary-signature");
                              const { timestamp, signature, folder, cloudName, apiKey } = await sigRes.json();
                              
                              if (!signature) throw new Error("Could not get signature. Did you configure Cloudinary Keys in server/.env?");

                              const formData = new FormData();
                              formData.append("file", file);
                              formData.append("api_key", apiKey);
                              formData.append("timestamp", timestamp);
                              formData.append("signature", signature);
                              formData.append("folder", folder);
                              
                              const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
                                method: "POST",
                                body: formData,
                              });
                              
                              const data = await res.json();
                              if (data.secure_url) {
                                const successEx = [...(pkg.exercises || [])];
                                successEx[i].audioUrl = data.secure_url;
                                onChange({ ...pkg, exercises: successEx });
                              } else {
                                throw new Error(data.error?.message || "Upload failed");
                              }
                            } catch (err: any) {
                              alert("Cloudinary Upload Error: " + err.message);
                              const errorEx = [...(pkg.exercises || [])];
                              errorEx[i].audioUrl = "";
                              onChange({ ...pkg, exercises: errorEx });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
             <div className="text-center py-4 bg-white/5 rounded-xl border border-dashed border-white/10 text-xs text-slate-500">
               No private exercises added yet.
             </div>
            )}
          </div>

          {/* Highlight toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => onChange({ ...pkg, highlighted: !pkg.highlighted })}
              className={`w-10 h-6 rounded-full transition-colors relative ${pkg.highlighted ? "bg-indigo-600" : "bg-white/10"}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pkg.highlighted ? "left-5" : "left-1"}`} />
            </div>
            <span className="text-sm text-slate-300">Mark as highlighted / popular</span>
          </label>

          <div className="flex gap-4 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving || !pkg.name}
              className="flex-1 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-500/20 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Package"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Packages Manager ───────────────────────────────────────────────────
export function CoachMyPackages({ token }: { token: string }) {
  const [plans, setPlans] = useState<MeditationPackage[]>([]);
  const [editing, setEditing] = useState<Partial<MeditationPackage> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
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
      // Strip out our temporary string _ids before sending to Mongoose to avoid CastError
      const plansToSave = newPlans.map(p => {
        if (p._id && p._id.length < 20) { // If it's a short timestamp string, delete it
          const { _id, ...rest } = p;
          return rest;
        }
        return p;
      });

      const res = await fetch("http://localhost:5000/api/users/me/coach-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plans: plansToSave }),
      });
      
      if (!res.ok) {
        console.error("Save failed:", await res.text());
      } else {
        fetchPlans(); // Fetch fresh data to get real ObjectIds generated by DB
      }
    } catch (e) { console.error(e); }
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
        _id: Date.now().toString(), // temporary so React lists can key it optimistically
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    await savePlans(plans.filter((p) => p._id !== id));
  };

  if (loading) return <div className="py-12 text-center text-slate-500 text-sm">Loading packages...</div>;

  return (
    <div>
      {/* Top controls */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-slate-500 font-medium">{plans.length} package{plans.length !== 1 ? "s" : ""} created</p>
        <button
          onClick={() => setEditing({ name: "", price: 0, currency: "USD", period: "month", features: [], exercises: [], highlighted: false })}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-md shadow-teal-500/20"
        >
          <Plus className="w-5 h-5" /> Add Package
        </button>
      </div>

      {/* Packages list */}
      {plans.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/10">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm mb-1">No packages yet</p>
          <p className="text-slate-600 text-xs">Create your first meditation package to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`relative rounded-3xl p-7 border transition-all hover:shadow-lg ${
                plan.highlighted
                  ? "bg-gradient-to-br from-teal-50 to-white border-teal-200"
                  : "bg-white border-teal-50"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-2.5 left-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-2.5 h-2.5" /> Popular
                </span>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-semibold">{plan.name}</h4>
                  <p className="text-indigo-300 text-sm font-medium">
                    {plan.price === 0 ? "Free" : `${plan.price} ${plan.currency} / ${plan.period}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing({ ...plan })}
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => plan._id && handleDelete(plan._id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {plan.features.length > 0 && (
                <ul className="space-y-1.5 mb-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              )}

              {(plan.exercises || []).length > 0 && (
                <div className="pt-3 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-2">Private Course Curriculum</p>
                  <div className="space-y-1">
                    {(plan.exercises || []).map((ex, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-white/5 rounded-lg px-2.5 py-1.5 text-slate-300">
                        <span className="flex items-center gap-1.5 truncate pr-2">
                           <span className="w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] shrink-0">{i+1}</span>
                           <span className="truncate">{ex.title}</span>
                        </span>
                        <span className="text-slate-500 shrink-0">{ex.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Editing modal */}
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
