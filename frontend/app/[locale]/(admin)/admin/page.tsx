"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("content");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      window.location.href = "./home";
    }
  }, []);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchData = async () => {
    try {
      const endpoint = activeTab === "content" ? "/api/content" : "/api/live";
      const res = await fetch(`http://localhost:5000${endpoint}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const endpoint = activeTab === "content" ? `/api/content/${id}` : `/api/live/${id}`;
      await fetch(`http://localhost:5000${endpoint}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchData();
    } catch(err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = activeTab === "content" ? "/api/content" : "/api/live";
    const method = formData._id ? "PUT" : "POST";
    const url = formData._id ? `http://localhost:5000${endpoint}/${formData._id}` : `http://localhost:5000${endpoint}`;

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      fetchData();
      } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-rose-500 mb-2">Access Denied</h1>
          <p className="text-slate-500">You do not have administration privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-32 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage Mindfulness app content</p>
          </div>
          <button 
            onClick={() => { setFormData({}); setShowModal(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" /> Add New
          </button>
        </header>

        <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-white/10 pb-2">
          <button onClick={() => setActiveTab("content")} className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>Meditations</button>
          <button onClick={() => setActiveTab("live")} className={`px-4 py-2 font-medium ${activeTab === 'live' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>Live Sessions</button>
        </div>

        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10">
                <th className="py-4 font-medium text-slate-500">Title</th>
                <th className="py-4 font-medium text-slate-500">Image / Instructor</th>
                <th className="py-4 font-medium text-slate-500">{activeTab === 'content' ? 'Duration' : 'Time'}</th>
                <th className="py-4 font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any) => (
                <tr key={item._id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 font-medium">{item.title}</td>
                  <td className="py-4 text-sm text-slate-500">
                    <img src={item.image} alt="thumb" className="w-10 h-10 object-cover rounded-lg inline-block mr-3" />
                    {item.instructor}
                  </td>
                  <td className="py-4">{activeTab === 'content' ? item.duration : item.time}</td>
                  <td className="py-4 text-right">
                    <button onClick={() => { setFormData(item); setShowModal(true); }} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg inline-block mr-2"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg inline-block"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-slate-500">No data found. Please add new items.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-serif font-bold mb-6">{formData._id ? "Edit" : "Add"} {activeTab === 'content' ? "Meditation" : "Live Session"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instructor</label>
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
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 dark:bg-white/5 rounded-xl font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
