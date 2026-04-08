"use client";

import { useEffect, useState } from "react";
import { Bell, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  const [userName, setUserName] = useState("Friend");

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      try {
        const user = JSON.parse(data);
        if (user.name) setUserName(user.name);
      } catch(e) {}
    }
  }, []);

  return (
    <header className="px-6 pt-12 pb-4 flex justify-between items-center z-10 relative">
      <div className="flex flex-col">
        <h1 className="text-2xl font-serif font-medium text-slate-800 dark:text-slate-100">
          Good evening, {userName}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Are you ready to relax?</p>
      </div>
      <div className="flex gap-4 items-center">
        <button className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        <Link href="./profile" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm hover:scale-105 transition-transform">
          <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </Link>
      </div>
    </header>
  );
}
