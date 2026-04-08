"use client";

import { useEffect, useState } from "react";

export function ProfileHeader() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    // First load from local then sync with server
    const localData = localStorage.getItem("user");
    if (localData) setUser(JSON.parse(localData));
    
    fetchUser();
  }, []);

  const name = user?.name || "Guest";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-6 mb-8 bg-white dark:bg-[#1C1C1E] p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-serif uppercase shadow-inner">
        {initial}
      </div>
      <div>
        <h1 className="text-3xl font-serif font-medium text-slate-800 dark:text-slate-100">{name}</h1>
        <p className="text-slate-500 mt-1">{user?.email || "No email updated"}</p>
        <button className="mt-3 text-sm font-semibold text-indigo-500 hover:text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full outline-none">Upgrade to Pro</button>
      </div>
    </div>
  );
}
