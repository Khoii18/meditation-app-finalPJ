"use client";

import { useEffect, useState } from "react";
import { Bell, User, LogIn } from "lucide-react";
import Link from "next/link";

export function Header() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      try {
        const user = JSON.parse(data);
        if (user.name) setUserName(user.name);
      } catch(e) {}
    }
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="px-4 md:px-6 pt-8 md:pt-10 pb-4 flex justify-between items-center">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-teal-500 mb-1">{greeting}</p>
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-slate-800 leading-tight">
          {userName ? `Welcome back, ${userName.split(" ")[0]}` : "Welcome to Oasis"}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {userName ? "Ready for today's session?" : "Sign in to track your journey"}
        </p>
      </div>
      <div className="flex gap-3 items-center">
        <button className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500 hover:bg-teal-100 transition-colors">
          <Bell className="w-4.5 h-4.5" />
        </button>
        {userName ? (
          <Link href="./profile" className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-200 hover:bg-teal-600 transition-colors">
            {userName[0].toUpperCase()}
          </Link>
        ) : (
          <Link href="/vi/login" className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-teal-200">
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
