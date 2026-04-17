"use client";

import { useState, useEffect, Suspense } from "react";
import { Plus } from "lucide-react";
import { CoachTable } from "../components/CoachTable";
import { CoachFormModal } from "../components/CoachFormModal";
import { CoachMyPackages } from "../components/CoachMyPackages";
import { CoachProfileEditor } from "../components/CoachProfileEditor";
import { useSearchParams } from "next/navigation";

function CoachPageContent() {
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
    if (activeTab === "packages" || activeTab === "settings" || activeTab === "profile") return; // managed separately
    try {
      const endpoint = activeTab === "content" ? "/api/content" : "/api/live";
      const currentToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        headers: currentToken ? { "Authorization": `Bearer ${currentToken}` } : {}
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

  const handleEdit = (item: any) => {
    setFormData(item);
    setShowModal(true);
  };

  if (!user || (user.role !== "coach" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-rose-500 mb-2">Access Denied</h1>
          <p className="text-slate-500">You must be a coach to access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-32 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold">Coach Dashboard</h1>
            <p className="text-slate-500 mt-1">Hello {user?.name}! Manage your meditation courses and livestreams.</p>
          </div>
          {activeTab !== "packages" && activeTab !== "profile" && activeTab !== "settings" && (
            <button 
              onClick={() => { setFormData({}); setShowModal(true); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" /> Add New
            </button>
          )}
        </header>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-white/10 pb-2">
          {[
            { key: "content", label: "My Meditations" },
            { key: "live",    label: "My Live Sessions" },
            { key: "packages", label: "My Packages" },
            { key: "profile", label: "My Profile" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "profile" ? (
          <CoachProfileEditor token={token || ""} />
        ) : activeTab === "packages" ? (
          <CoachMyPackages token={token || ""} />
        ) : (
          <CoachTable 
            data={data}
            activeTab={activeTab}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <CoachFormModal 
        formData={formData}
        setFormData={setFormData}
        activeTab={activeTab}
        showModal={showModal}
        setShowModal={setShowModal}
        handleSave={handleSave}
        user={user}
      />
    </div>
  );
}

export default function CoachPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500">Loading Dashboard...</div>}>
      <CoachPageContent />
    </Suspense>
  );
}
