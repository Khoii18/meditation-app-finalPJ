"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flower2, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function MeditationLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data || "Đăng nhập thất bại");
      }

      // Lưu trữ token và thông tin user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Chuyển hướng
      router.push("/"); 

    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans">
      {/* Soft Background Gradient & Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop')",
          filter: "contrast(0.95) saturate(0.8)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-emerald-800/20 to-lime-900/30 backdrop-blur-sm z-0" />

      {/* Main Glass Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 mx-4 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
      >
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-16 h-16 bg-white/80 dark:bg-white/10 backdrop-blur rounded-full flex items-center justify-center mb-6 shadow-sm"
          >
            <Flower2 
              className="w-8 h-8 text-teal-600 dark:text-teal-400" 
              strokeWidth={1.5} 
            />
          </motion.div>
          <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2 text-center">
            Chào mừng trở lại
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
            Hãy hít một hơi thật sâu và tiếp tục hành trình tinh thần của bạn.
          </p>
        </div>

        {/* Form */}
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-5"
          onSubmit={handleLogin}
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300 ml-1">
              Email của bạn
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="email"
                placeholder="namaste@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-zinc-800/50 border border-white/60 dark:border-zinc-700/50 rounded-2xl text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white/80 dark:focus:bg-zinc-800/80 transition-all duration-300"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                Mật khẩu
              </label>
              <button type="button" className="text-xs text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors">
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-12 py-3.5 bg-white/50 dark:bg-zinc-800/50 border border-white/60 dark:border-zinc-700/50 rounded-2xl text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white/80 dark:focus:bg-zinc-800/80 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              <>
                Bắt đầu thiền
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-8 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400"
        >
          <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></div>
          <span className="px-3">Hoặc tiếp tục với</span>
          <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></div>
        </motion.div>

        {/* Social Logins */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <button className="flex items-center justify-center py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition-colors shadow-sm">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Google</span>
          </button>
        </motion.div>

        {/* Sign Up Link */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400"
        >
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-teal-700 dark:text-teal-400 font-medium hover:underline">
            Đăng ký ngay
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
