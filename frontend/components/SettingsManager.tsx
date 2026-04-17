"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Lock, Globe, CheckCircle } from "lucide-react";

export function SettingsManager() {
  const router = useRouter();
  const pathname = usePathname();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isVi = pathname.startsWith("/vi");

  const changeLanguage = (lang: string) => {
    const segments = pathname.split("/");
    segments[1] = lang;
    router.push(segments.join("/"));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/me/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setSuccess(true);
        setPassword("");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Action failed. Try again.");
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl text-slate-800 dark:text-slate-200">
      <h2 className="text-2xl font-serif font-bold mb-8">{isVi ? "Cài đặt & Bảo mật" : "Settings & Security"}</h2>
      
      {/* Target Language Selection */}
      <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold text-lg">{isVi ? "Ngôn ngữ" : "Language"}</h3>
        </div>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => changeLanguage("en")}
            className={`flex-1 py-3 rounded-xl border-2 font-medium transition-colors ${!isVi ? 'border-indigo-600 text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500' : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'}`}
          >
            English
          </button>
          <button 
            type="button"
            onClick={() => changeLanguage("vi")}
            className={`flex-1 py-3 rounded-xl border-2 font-medium transition-colors ${isVi ? 'border-indigo-600 text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500' : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'}`}
          >
            Tiếng Việt
          </button>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-rose-500" />
          <h3 className="font-semibold text-lg">{isVi ? "Đổi mật khẩu" : "Change Password"}</h3>
        </div>
        
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 opacity-70">{isVi ? "Mật khẩu mới" : "New Password"}</label>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 rounded-2xl transition-colors flex justify-center items-center gap-2">
            {loading ? "..." : success ? <><CheckCircle className="w-5 h-5"/> {isVi ? "Đã cập nhật" : "Updated"}</> : (isVi ? "Xác nhận đổi" : "Change Password")}
          </button>
        </form>
      </div>
    </div>
  );
}
