"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Wind } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { API_URL } from "@/config";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password"); return; }
    try {
      setLoading(true); setError("");
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "admin") router.push("./admin");
      else if (data.user.role === "coach") router.push("./coach");
      else if (returnUrl) router.push(decodeURIComponent(returnUrl));
      else router.push("./home");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    router.push("/vi/home");
  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden bg-[#080B14]">
      {/* Left — Immersive Nature Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?q=85&w=2000&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B14]/60 via-[#080B14]/10 to-[#080B14]/80" />

        {/* Floating Orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-72 h-72 rounded-full bg-indigo-500/20 blur-[80px] top-1/4 left-1/4"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute w-56 h-56 rounded-full bg-violet-400/20 blur-[60px] bottom-1/3 right-1/4"
        />

        {/* Quote */}
        <div className="relative z-10 px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2 }}
          >
            <Wind className="w-10 h-10 text-indigo-400/80 mx-auto mb-8" strokeWidth={1} />
            <p className="text-white/90 text-2xl font-serif leading-relaxed italic mb-6">
              "The present moment is the only moment available to us, and it is the door to all moments."
            </p>
            <p className="text-white/40 text-sm tracking-widest uppercase">— Thich Nhat Hanh</p>
          </motion.div>
        </div>

        {/* Oasis branding */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-lg" />
            <span className="text-white/60 font-serif text-lg">Oasis</span>
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-16 relative">
        {/* Mobile background */}
        <div className="absolute inset-0 lg:hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?q=85&w=1000&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-[#080B14]/85" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500" />
            <span className="text-white font-serif text-xl">Oasis</span>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-serif text-white mb-3 leading-tight"
            >
              Find your<br />stillness again.
            </motion.h1>
            <p className="text-white/40 text-sm">Sign in to continue your mindful journey.</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-2xl mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 focus:border-indigo-500/60 rounded-2xl text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-12 py-4 bg-white/5 border border-white/10 focus:border-indigo-500/60 rounded-2xl text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Sign In button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/25 text-xs tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Continue as Guest */}
          <button
            onClick={continueAsGuest}
            className="w-full py-3.5 rounded-2xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/8 text-white/60 hover:text-white/80 text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <Wind className="w-4 h-4" />
            Continue as Guest
          </button>

          {/* Footer links */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-white/30 text-sm">
              New to Oasis?{" "}
              <Link href="./register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Create account
              </Link>
            </p>
            {returnUrl && (
              <p className="text-white/20 text-xs text-center">
                You'll be taken back after signing in.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
