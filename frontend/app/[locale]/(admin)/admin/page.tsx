"use client";

import { useState, useEffect, Suspense } from "react";
import { Plus, Users, FileText, CalendarDays, Smile, Moon, Layers, Mail } from "lucide-react";
import { AdminTable } from "../components/AdminTable";
import { AdminFormModal } from "../components/AdminFormModal";
import { UsersManagement } from "../components/UsersManagement";
import { EmotionsAnalytics } from "../components/EmotionsAnalytics";
import { PaymentsManagement } from "../components/PaymentsManagement";
import { RoutineManagement } from "../components/RoutineManagement";
import { AdminMessages } from "../components/AdminMessages";
import { SessionStatsPanel } from "../components/SessionStatsPanel";
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
    if (activeTab === "users" || activeTab === "emotions" || activeTab === "settings" || activeTab === "payments") return;
    try {
      const endpoint = "/api/content";
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
      const endpoint = `/api/content/${id}`;
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
    const endpoint = "/api/content";
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
    { key: "content",     label: "Meditations",   icon: FileText },
    { key: "soundscapes", label: "Soundscapes",   icon: FileText },
    { key: "sleep",       label: "Sleep Stories", icon: Moon },
    { key: "plans",       label: "Plans",         icon: Layers },
    { key: "users",       label: "Users",         icon: Users },
    { key: "payments",    label: "Payments",      icon: FileText },
    { key: "emotions",    label: "Emotions",      icon: Smile },
    { key: "messages",    label: "Messages",      icon: Mail },
    { key: "routine",     label: "Routine",       icon: CalendarDays },
    { key: "sessions",    label: "Sessions",      icon: FileText },
  ];

  const filteredData = Array.isArray(data) ? data.filter((d: any) => {
    if (activeTab === "sleep") return d.type?.toLowerCase().includes("sleep");
    if (activeTab === "soundscapes") return d.type?.toLowerCase().includes("soundscape");
    if (activeTab === "plans") return d.type?.toLowerCase().includes("plan");
    if (activeTab === "content") return !d.type?.toLowerCase().includes("sleep") && !d.type?.toLowerCase().includes("plan") && !d.type?.toLowerCase().includes("soundscape");
    return true;
  }) : [];
  return (
    <div className="p-8 pb-32 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage Oasis app content & users</p>
          </div>
          {activeTab !== "users" && activeTab !== "payments" && activeTab !== "emotions" && activeTab !== "sessions" && (
            <button
              onClick={() => { setFormData({}); setShowModal(true); }}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all shadow-sm shadow-teal-500/20"
            >
              <Plus className="w-5 h-5" /> Add New
            </button>
          )}
        </header>

        {/* Tab content */}
        <div className="pt-4">
          {activeTab === "users" ? (
          <UsersManagement token={token || ""} />
        ) : activeTab === "payments" ? (
          <PaymentsManagement token={token || ""} />
        ) : activeTab === "emotions" ? (
          <EmotionsAnalytics token={token || ""} />
        ) : activeTab === "messages" ? (
          <AdminMessages token={token || ""} />
        ) : activeTab === "routine" ? (
          <RoutineManagement token={token || ""} />
        ) : activeTab === "sessions" ? (
          <SessionStatsPanel token={token || ""} />
        ) : (
          <AdminTable
            data={filteredData}
            activeTab={activeTab}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>

      <AdminFormModal
        formData={formData}
        setFormData={setFormData}
        activeTab={activeTab}
        showModal={showModal}
        setShowModal={setShowModal}
        handleSave={handleSave}
        existingData={data}
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
