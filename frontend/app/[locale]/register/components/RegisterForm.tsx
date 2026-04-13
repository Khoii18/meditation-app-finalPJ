"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flower2, Mail, Lock, Eye, EyeOff, UserCircle, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"user" | "coach">("user");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data || "Registration failed");
      }

      router.push("./login"); 

    } catch (err: any) {
      setError(err.message || "A system error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans py-12">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop')",
          filter: "contrast(0.95) saturate(0.8)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 via-emerald-800/30 to-indigo-900/40 backdrop-blur-sm z-0" />

      {/* Main Glass Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 mx-4 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-16 h-16 bg-white/80 dark:bg-white/10 backdrop-blur rounded-full flex items-center justify-center mb-4 shadow-sm"
          >
            <Flower2 className="w-8 h-8 text-teal-600 dark:text-teal-400" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1 text-center">
            Start Your Journey
          </h1>
          {/* Animated role description */}
          <motion.p
            key={role}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-center mt-1 font-medium"
            style={{ color: role === "coach" ? "#7c3aed" : "#0f766e" }}
          >
            {role === "user"
              ? "🧘 You are registering as a Student"
              : "🏅 You are registering as a Coach"}
          </motion.p>
        </div>

        {/* Animated Role Toggle */}
        <div className="relative flex bg-zinc-100/80 dark:bg-zinc-800/60 rounded-2xl p-1 mb-6 shadow-inner">
          {/* Sliding pill background */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-xl shadow-md"
            animate={{
              left: role === "user" ? "4px" : "calc(50% + 2px)",
              width: "calc(50% - 6px)",
              background: role === "user"
                ? "linear-gradient(to right, #14b8a6, #10b981)"
                : "linear-gradient(to right, #6366f1, #a855f7)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
              role === "user" ? "text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            🧘 Student
          </button>
          <button
            type="button"
            onClick={() => setRole("coach")}
            className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
              role === "coach" ? "text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            🏅 Coach
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Name Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300 ml-1">Display Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserCircle className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Roy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-zinc-800/50 border border-white/60 dark:border-zinc-700/50 rounded-2xl text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300 ml-1">Your Email</label>
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
                className="w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-zinc-800/50 border border-white/60 dark:border-zinc-700/50 rounded-2xl text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300 ml-1">Password</label>
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
                minLength={6}
                className="w-full pl-11 pr-12 py-3.5 bg-white/50 dark:bg-zinc-800/50 border border-white/60 dark:border-zinc-700/50 rounded-2xl text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button - color changes with role */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            animate={{
              background: role === "coach"
                ? ["linear-gradient(to right, #6366f1, #a855f7)"]
                : ["linear-gradient(to right, #0d9488, #059669)"],
            }}
            transition={{ duration: 0.4 }}
            className="w-full mt-6 py-3.5 rounded-2xl text-white font-medium shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: role === "coach"
                ? "linear-gradient(to right, #6366f1, #a855f7)"
                : "linear-gradient(to right, #0d9488, #059669)",
            }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {role === "coach" ? "Register as Coach" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <a href="./login" className="text-teal-700 dark:text-teal-400 font-medium hover:underline">
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  );
}
