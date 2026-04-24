"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface AuthGatewayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthGateway({ isOpen, onClose }: AuthGatewayProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'vi';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10 text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-3">Login Required</h2>
            <p className="text-slate-500 mb-8">To use this feature and access all content, you must be logged in to your account.</p>

            <div className="space-y-3">
              <button 
                onClick={() => router.push(`/${locale}/register?redirect=${encodeURIComponent(pathname)}`)}
                className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20"
              >
                Create an Account
              </button>
              <button 
                onClick={() => router.push(`/${locale}/login?redirect=${encodeURIComponent(pathname)}`)}
                className="w-full py-4 bg-white text-teal-600 border-2 border-teal-100 rounded-2xl font-bold hover:bg-teal-50 transition-all"
              >
                Sign In
              </button>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-3 uppercase tracking-widest font-bold">For Instructors</p>
                <button 
                  onClick={() => router.push(`/${locale}/register?role=coach&redirect=${encodeURIComponent(pathname)}`)}
                  className="w-full py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all border border-slate-200"
                >
                  Register as a Coach
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
