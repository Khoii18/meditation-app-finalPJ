"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, UserCircle, Loader2, ArrowRight, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { API_URL } from "@/config";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"user" | "coach">("user");

  const QUOTES = [
    { text: "Mindfulness isn't difficult. We just need to remember to do it.", author: "Sharon Salzberg" },
    { text: "The soul always knows what to do to heal itself. The challenge is to silence the mind.", author: "Caroline Myss" },
    { text: "Quiet the mind and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
    { text: "Your goal is not to battle with the mind, but to witness the mind.", author: "Swami Muktananda" },
    { text: "The act of meditation is being spacious.", author: "Sogyal Rinpoche" },
    { text: "Peace is a journey of a thousand miles and it must be taken one step at a time.", author: "Lyndon B. Johnson" }
  ];

  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields"); return; }
    try {
      setLoading(true); setError("");
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data || "Registration failed");
      router.push("./login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden bg-[#080B14]">
      {/* Left — Nature Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5?q=85&w=2000&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B14]/70 via-[#080B14]/10 to-[#080B14]/80" />

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-80 h-80 rounded-full bg-violet-500/20 blur-[80px] top-1/3 left-1/3"
        />

        <div className="relative z-10 px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2 }}
          >
            <Leaf className="w-10 h-10 text-emerald-400/80 mx-auto mb-8" strokeWidth={1} />
            <p className="text-white/90 text-2xl font-serif leading-relaxed italic mb-6">
              "{quote.text}"
            </p>
            <p className="text-white/40 text-sm tracking-widest uppercase">— {quote.author}</p>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-lg" />
            <span className="text-white/60 font-serif text-lg">Lunaria</span>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-16 relative">
        {/* Mobile bg */}
        <div className="absolute inset-0 lg:hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5?q=85&w=1000&auto=format&fit=crop')",
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
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500" />
            <span className="text-white font-serif text-xl">Lunaria</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-serif text-white mb-3 leading-tight"
            >
              Begin your<br />mindful path.
            </motion.h1>
            <p className="text-white/40 text-sm">Create your account and start your journey.</p>
          </div>

          {/* Role toggle — minimal pill style */}
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-6 gap-1">
            {(["user", "coach"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  role === r
                    ? r === "coach"
                      ? "bg-violet-600 text-white shadow"
                      : "bg-indigo-600 text-white shadow"
                    : "text-white/35 hover:text-white/60"
                }`}
              >
                {r === "user" ? "🧘 Student" : "🏅 Coach"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-2xl mb-5"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Name */}
            <div className="relative group">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 focus:border-indigo-500/60 rounded-2xl text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all text-sm"
              />
            </div>

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
                placeholder="Password (min. 6 chars)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
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

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className={`w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2.5 transition-all shadow-lg disabled:opacity-60 mt-2 ${
                role === "coach"
                  ? "bg-violet-600 hover:bg-violet-500 shadow-violet-600/25"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25"
              }`}
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

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/30 text-sm">
              Already have an account?{" "}
              <Link href="./login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
