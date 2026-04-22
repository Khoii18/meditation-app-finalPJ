"use client";

import { useEffect } from "react";

export function CoachFormModal({ formData, setFormData, activeTab, showModal, setShowModal, handleSave, user }: any) {
  // Pre-fill instructor with the logged-in coach's name when opening the modal for a new item
  useEffect(() => {
    if (showModal && !formData._id && user) {
      setFormData((prev: any) => ({ ...prev, instructor: user.name || "Coach" }));
    }
  }, [showModal, formData._id, user, setFormData]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-teal-100">
        <h2 className="text-2xl font-serif font-bold mb-6 text-slate-800">{formData._id ? "Edit" : "Add"} {activeTab === 'content' ? "Meditation" : "Live Session"}</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Title</label>
            <input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 rounded-2xl border border-teal-100 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instructor (Default is you)</label>
            <input required value={formData.instructor || ''} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image URL</label>
            <input required value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" placeholder="https://..." />
          </div>
          {activeTab === 'content' ? (
             <>
               <div>
                 <label className="block text-sm font-medium mb-1">Category</label>
                 <input required value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" placeholder="Meditation, Sleep, Focus..." />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Duration</label>
                 <input required value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" placeholder="10 min" />
               </div>
             </>
          ) : (
             <>
               <div>
                 <label className="block text-sm font-medium mb-1">Time</label>
                 <input required value={formData.time || ''} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" placeholder="18:00" />
               </div>
               <div className="flex items-center gap-3">
                 <label className="text-sm font-medium">Is Live Now?</label>
                 <input type="checkbox" checked={formData.isLive || false} onChange={e => setFormData({...formData, isLive: e.target.checked})} className="w-5 h-5" />
               </div>
             </>
          )}
          
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-slate-600 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold shadow-md shadow-teal-500/20 transition-all">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
