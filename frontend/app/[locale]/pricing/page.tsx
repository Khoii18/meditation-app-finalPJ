"use client";

import { PricingCards } from "./components/PricingCards";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function PricingPage() {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-12 pb-24 relative"
    >
      <button 
        onClick={() => router.back()}
        className="absolute top-12 left-4 md:left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Back
      </button>

      <div className="text-center max-w-2xl mx-auto mb-16 pt-12 md:pt-0">
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-slate-800 mb-4">Invest in your mind.</h1>
        <p className="text-lg text-slate-500">Unlock personalized plans, sleep stories, and expert guidance to find your balance every day.</p>
      </div>

      <PricingCards />
      
      <p className="text-center text-xs text-slate-400 mt-12 max-w-xl mx-auto">
        Subscriptions automatically renew unless auto-renew is turned off at least 24-hours before the end of the current period.
      </p>
    </motion.div>
  );
}
