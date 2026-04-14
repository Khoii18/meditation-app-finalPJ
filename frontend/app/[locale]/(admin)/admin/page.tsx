"use client";

import { useState, useEffect, Suspense } from "react";
import { Plus, Users, FileText, CalendarDays, Smile } from "lucide-react";
import { AdminTable } from "../components/AdminTable";
import { AdminFormModal } from "../components/AdminFormModal";
import { UsersManagement } from "../components/UsersManagement";
import { EmotionsAnalytics } from "../components/EmotionsAnalytics";
import { useSearchParams } from "next/navigation";

function AdminPageContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "content";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setActiveTab(searchParams.get("tab") || "content");
  }, [searchParams]);

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
    if (activeTab === "users" || activeTab === "emotions") return;
    try {
      const endpoint = activeTab === "content" ? "/api/content" : "/api/live";
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
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
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = activeTab === "content" ? "/api/content" : "/api/live";
    const method = formData._id ? "PUT" : "POST";
    const url = formData._id
      ? `http://localhost:5000${endpoint}/${formData._id}`
      : `http://localhost:5000${endpoint}`;

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setShowModal(true);
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

  const TABS = [
    { key: "content",   label: "Meditations",  icon: FileText },
    { key: "live",      label: "Live Sessions", icon: CalendarDays },
    { key: "users",     label: "Users",         icon: Users },
    { key: "emotions",  label: "Emotions",      icon: Smile },
  ];

  return (
    <div className="p-8 pb-32 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage Mindfulness app content & users</p>
          </div>
          {activeTab !== "users" && (
            <button
              onClick={() => { setFormData({}); setShowModal(true); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-colors"
            >
              <Plus className="w-5 h-5" /> Add New
            </button>
          )}
        </header>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-white/10 pb-0">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3 font-medium text-sm rounded-t-xl transition-colors border-b-2 ${
                activeTab === key
                  ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                  : "text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "users" ? (
          <UsersManagement token={token || ""} />
        ) : activeTab === "emotions" ? (
          <EmotionsAnalytics token={token || ""} />
        ) : (
          <AdminTable
            data={data}
            activeTab={activeTab}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <AdminFormModal
        formData={formData}
        setFormData={setFormData}
        activeTab={activeTab}
        showModal={showModal}
        setShowModal={setShowModal}
        handleSave={handleSave}
      />
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500">Loading Dashboard...</div>}>
      <AdminPageContent />
    </Suspense>
  );
}
