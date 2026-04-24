"use client";

import { ArrowLeft, ShieldCheck, Eye, Lock, Database } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pt-12 pb-24">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Back to Profile
      </button>

      <header className="mb-12">
        <div className="w-16 h-16 bg-teal-500/10 text-teal-600 rounded-[2rem] flex items-center justify-center mb-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-serif font-medium text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted leading-relaxed">
          At Lunaria, we believe your mental well-being journey is sacred. That's why we've built our platform with your privacy at the core.
        </p>
      </header>

      <div className="space-y-10">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-foreground">Data Transparency</h2>
          </div>
          <p className="text-sm text-muted leading-relaxed pl-8">
            We only collect data that helps us personalize your experience, such as your selected paths, meditation history, and mood check-ins. We never sell your data to third parties.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-foreground">End-to-End Security</h2>
          </div>
          <p className="text-sm text-muted leading-relaxed pl-8">
            All your personal reflections and journal entries are encrypted. Only you can access your private thoughts.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg font-bold text-foreground">Your Right to Delete</h2>
          </div>
          <p className="text-sm text-muted leading-relaxed pl-8">
            You have full control over your account. You can request a full data export or permanent deletion of your account at any time through the support center.
          </p>
        </section>

        <div className="pt-10 border-t border-border">
          <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-bold">Last Updated: April 2024</p>
        </div>
      </div>
    </div>
  );
}
