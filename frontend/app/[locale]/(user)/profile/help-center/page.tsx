"use client";

import { ArrowLeft, Search, MessageSquare, Mail, ChevronRight, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function HelpCenterPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How do I cancel my subscription?", a: "Go to Settings > Account > Manage Subscription to view your billing status." },
    { q: "Can I use Lunaria offline?", a: "Yes, Premium members can download sessions to use without an internet connection." },
    { q: "How do I reset my journey progress?", a: "You can find this option in Preferences > Reset Progress. This action is permanent." },
    { q: "My audio is not playing.", a: "Please check your device volume and silent mode. If it persists, try clearing the app cache." },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pt-12 pb-24">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Back to Profile
      </button>

      <header className="mb-12">
        <h1 className="text-4xl font-serif font-medium text-foreground mb-6">How can we help?</h1>
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input 
            type="text" 
            placeholder="Search for articles, guides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-16 pl-14 pr-6 bg-surface rounded-3xl border border-border shadow-sm focus:outline-none focus:border-indigo-500/50 transition-all text-foreground"
          />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-12">
        <button className="flex flex-col items-center justify-center p-8 bg-indigo-500/10 rounded-[2.5rem] border border-indigo-500/20 group hover:bg-indigo-600 transition-all duration-300">
          <MessageSquare className="w-8 h-8 text-indigo-600 group-hover:text-white mb-3" />
          <span className="font-bold text-foreground group-hover:text-white">Live Chat</span>
          <span className="text-xs text-indigo-500 group-hover:text-indigo-100 mt-1 text-center">Avg. response: 5 mins</span>
        </button>
        <a 
          href="mailto:support@lunaria.app"
          className="flex flex-col items-center justify-center p-8 bg-teal-500/10 rounded-[2.5rem] border border-teal-500/20 group hover:bg-teal-600 transition-all duration-300"
        >
          <Mail className="w-8 h-8 text-teal-600 group-hover:text-white mb-3" />
          <span className="font-bold text-foreground group-hover:text-white">Email Us</span>
          <span className="text-xs text-teal-500 group-hover:text-teal-100 mt-1 text-center">Support@lunaria.app</span>
        </a>
      </div>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-6 px-2 opacity-70">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className={`bg-surface rounded-[2rem] border border-border p-6 transition-all cursor-pointer group ${openFaq === i ? "ring-2 ring-indigo-500/20 border-indigo-500/50" : "hover:border-indigo-500/30"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <HelpCircle className={`w-5 h-5 transition-colors ${openFaq === i ? "text-indigo-500" : "text-muted opacity-50"}`} />
                  <h3 className="font-semibold text-foreground text-sm">{faq.q}</h3>
                </div>
                <ChevronRight className={`w-4 h-4 text-muted transition-transform duration-300 ${openFaq === i ? "rotate-90" : ""}`} />
              </div>
              {openFaq === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-4 pt-4 border-t border-border"
                >
                  <p className="text-sm text-muted leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
