"use client";

import { useState } from "react";
import {
  Home, Flame, CreditCard, LogOut, Sparkles, Moon,
  Map as MapIcon, Users, Lock, LogIn, UserPlus,
  ChevronDown, TrendingUp, BookOpen, Flower2, Shield
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user: authUser } = useAuth();
  const user = authUser as any;
  const locale = pathname.split('/')[1] || 'vi';

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-surface border-r border-border py-10 px-6 z-40 shadow-[1px_0_10px_rgba(0,0,0,0.02)] transition-colors duration-500">
      {/* CSS to force hide scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Brand Logo - Elegant & Minimal */}
      <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => router.push(`/${locale}/home`)}>
        <motion.img 
          src="/lunaria-logo.svg" 
          alt="Lunaria" 
          className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
        <span className="font-serif font-medium text-2xl tracking-tight text-foreground">Lunaria</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-8 overflow-y-auto hide-scrollbar">
        
        {/* Main Section */}
        <div className="space-y-1.5">
          <NavItem href={`/${locale}/home`} icon={<Home className="w-5 h-5" />} label="Focus" isActive={pathname.includes("/home")} />
        </div>

        {/* Growth Section */}
        <div className="space-y-4">
          <div className="px-4 flex items-center justify-between">
            <p className="text-[9px] font-black tracking-[0.2em] text-muted opacity-50 uppercase">Growth</p>
            <div className="h-px w-8 bg-border"></div>
          </div>
          <div className="space-y-1">
            <NavItem href={`/${locale}/plans`} icon={<MapIcon className="w-5 h-5" />} label="Plans" isActive={pathname.includes("/plans")} />
            <NavItem href={`/${locale}/streak`} icon={<Flame className="w-5 h-5" />} label="Streak" isActive={pathname.includes("/streak")} />
            <NavItem href={`/${locale}/journey`} icon={<TrendingUp className="w-5 h-5" />} label="Journey" isActive={pathname.includes("/journey")} />
          </div>
        </div>

        {/* Coaching Section */}
        <div className="space-y-4">
          <div className="px-4 flex items-center justify-between">
            <p className="text-[9px] font-black tracking-[0.2em] text-muted opacity-50 uppercase">Coaching</p>
            <div className="h-px w-8 bg-border"></div>
          </div>
          <div className="space-y-1">
            <NavItem href={`/${locale}/coaches`} icon={<Users className="w-5 h-5" />} label="Coaches" isActive={pathname.includes("/coaches")} />
            <NavItem href={`/${locale}/ai-coach`} icon={<Sparkles className="w-5 h-5" />} label="Lunaria AI" isActive={pathname.includes("/ai-coach")} />
          </div>
        </div>

        {/* Sanctuary Section */}
        <div className="space-y-4">
          <div className="px-4 flex items-center justify-between">
            <p className="text-[9px] font-black tracking-[0.2em] text-muted opacity-50 uppercase">Sanctuary</p>
            <div className="h-px w-8 bg-border"></div>
          </div>
          <div className="space-y-1">
            <NavItem href={`/${locale}/sleep`} icon={<Moon className="w-5 h-5" />} label="Dreamscape" isActive={pathname.includes("/sleep")} />
            <NavItem href={`/${locale}/pricing`} icon={<CreditCard className="w-5 h-5" />} label="Pricing" isActive={pathname.includes("/pricing")} />
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="mt-8 pt-8 border-t border-slate-50">
        {isLoggedIn ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-teal-50 dark:bg-white/5 border border-teal-100 dark:border-white/10 shadow-sm">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-200">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                {user?.premiumStatus?.isPremium && (
                  <div className="absolute -top-1.5 -right-1.5 p-1 bg-amber-400 rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
                    <Shield className="w-2.5 h-2.5 text-white fill-current" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate leading-none mb-1.5 capitalize">
                  {user?.name}
                </p>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-[9px] text-teal-600 dark:text-teal-400 font-black uppercase tracking-widest opacity-80">Mind Aware</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => { localStorage.removeItem("user"); localStorage.removeItem("token"); window.location.href = `/${locale}/login`; }}
              className="flex items-center gap-3 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-rose-500 transition-all w-full rounded-xl hover:bg-rose-50/10"
            >
              <LogOut className="w-5 h-5" /> Log Out
            </button>
          </div>
        ) : (
          <NavItem href={`/${locale}/login`} icon={<LogIn className="w-5 h-5" />} label="Begin Journey" isActive={pathname.includes("/login")} />
        )}
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 group ${
        isActive
          ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
          : "text-muted hover:bg-background hover:text-teal-600"
      }`}
    >
      <span className={`transition-all duration-300 ${isActive ? "text-white" : "text-teal-500 group-hover:scale-110"}`}>
        {icon}
      </span>
      <span className="tracking-wide">{label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
      )}
    </Link>
  );
}
