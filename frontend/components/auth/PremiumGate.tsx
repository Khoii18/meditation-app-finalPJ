"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface PremiumGateProps {
  open: boolean;
  onClose: () => void;
  contentTitle?: string;
}

export function PremiumGate({ open, onClose, contentTitle }: PremiumGateProps) {
  const { isLoggedIn } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#1C1C1E] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Header gradient */}
            <div className="relative h-40 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 border border-white/30 shadow-xl">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium tracking-wide uppercase">Premium Content</span>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                {isLoggedIn ? "Unlock Premium" : "Join Oasis"}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {contentTitle
                  ? `"${contentTitle}" is`
                  : "This content is"}{" "}
                {isLoggedIn
                  ? "part of our premium library. Subscribe to unlock hundreds of expert-guided meditations."
                  : "part of our premium library. Create a free account to start, or subscribe for full access."}
              </p>

              {/* Perks list */}
              <div className="space-y-2 mb-6">
                {[
                  "Unlimited guided meditations",
                  "Sleep stories & soundscapes",
                  "Personalized plans for your goals",
                  "Progress tracking & streaks"
                ].map((perk) => (
                  <div key={perk} className="flex items-center gap-2 text-sm text-slate-300">
                    <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    {perk}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              {isLoggedIn ? (
                <>
                  <Link
                    href="/vi/pricing"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-2xl transition-all hover:shadow-lg hover:shadow-indigo-500/30 mb-3"
                  >
                    View Plans
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={onClose}
                    className="w-full py-3 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
                  >
                    Maybe later
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/vi/register"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-2xl transition-all hover:shadow-lg hover:shadow-indigo-500/30 mb-3"
                  >
                    Create Free Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/vi/login"
                    onClick={onClose}
                    className="flex items-center justify-center w-full py-3 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
                  >
                    Already have an account? Sign in
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
