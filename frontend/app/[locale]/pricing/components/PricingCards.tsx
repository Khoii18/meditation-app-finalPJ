"use client";

import { CheckCircle2, Star } from "lucide-react";

export function PricingCards() {
  const plans = [
    { name: "Monthly", price: "$12.99", period: "/month", desc: "For those exploring their journey.", popular: false, color: "bg-white dark:bg-[#1C1C1E]", border: "border-slate-100 dark:border-white/5", text: "text-slate-800 dark:text-white" },
    { name: "Annual", price: "$69.99", period: "/year", desc: "Best value. Commit to your mind.", popular: true, color: "bg-gradient-to-br from-indigo-500 to-violet-600", border: "border-transparent", text: "text-white" },
    { name: "Lifetime", price: "$299", period: " once", desc: "Forever access to all features.", popular: false, color: "bg-slate-900 dark:bg-black", border: "border-slate-800", text: "text-white" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan, idx) => (
        <div key={idx} className={`relative flex flex-col p-8 rounded-[2.5rem] border shadow-xl ${plan.color} ${plan.border} ${plan.text} ${plan.popular ? 'scale-105 z-10 shadow-indigo-500/20' : 'shadow-black/5'}`}>
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-current" /> Most Popular
            </div>
          )}
          
          <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-semibold">{plan.price}</span>
            <span className="opacity-70 text-sm">{plan.period}</span>
          </div>
          <p className="text-sm opacity-80 mb-8">{plan.desc}</p>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['Personalized daily plans', 'Unlimited single meditations', 'Sleep tracking & sounds', 'Offline downloads'].map((feat, i) => (
              <li key={i} className="flex items-start gap-3 text-sm opacity-90">
                <CheckCircle2 className="w-5 h-5 opacity-70 shrink-0" /> {feat}
              </li>
            ))}
          </ul>

          <button className={`w-full py-4 rounded-2xl font-semibold transition-transform active:scale-95 ${plan.popular ? 'bg-white text-indigo-600 shadow-lg' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
            Choose {plan.name}
          </button>
        </div>
      ))}
    </div>
  );
}
