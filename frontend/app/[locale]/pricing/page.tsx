"use client";

import { PricingCards } from "./components/PricingCards";

export default function PricingPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-12 pb-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-slate-800 dark:text-slate-100 mb-4">Invest in your mind.</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">Unlock personalized plans, sleep stories, and expert guidance to find your balance every day.</p>
      </div>

      <PricingCards />
      
      <p className="text-center text-xs text-slate-400 mt-12 max-w-xl mx-auto">
        Subscriptions automatically renew unless auto-renew is turned off at least 24-hours before the end of the current period.
      </p>
    </div>
  );
}
