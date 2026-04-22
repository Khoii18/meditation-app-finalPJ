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

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user: authUser } = useAuth();
  const user = authUser as any;
  const locale = pathname.split('/')[1] || 'vi';

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-white border-r border-teal-50 py-10 px-6 z-40 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
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
        <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-600/20 group-hover:scale-105 transition-transform duration-300">
           <Flower2 className="text-white w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-serif font-bold text-xl tracking-tight text-slate-800">Lunaria</span>
          <span className="text-[7px] uppercase font-black tracking-[0.3em] text-teal-600 mt-0.5 opacity-60">Divine Grace</span>
        </div>
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
            <p className="text-[9px] font-black tracking-[0.2em] text-slate-300 uppercase">Growth</p>
            <div className="h-px w-8 bg-slate-100"></div>
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
            <p className="text-[9px] font-black tracking-[0.2em] text-slate-300 uppercase">Coaching</p>
            <div className="h-px w-8 bg-slate-100"></div>
          </div>
          <div className="space-y-1">
            <NavItem href={`/${locale}/coaches`} icon={<Users className="w-5 h-5" />} label="Coaches" isActive={pathname.includes("/coaches")} />
            <NavItem href={`/${locale}/ai-coach`} icon={<Sparkles className="w-5 h-5" />} label="Lunaria AI" isActive={pathname.includes("/ai-coach")} />
          </div>
        </div>

        {/* Sanctuary Section */}
        <div className="space-y-4">
          <div className="px-4 flex items-center justify-between">
            <p className="text-[9px] font-black tracking-[0.2em] text-slate-300 uppercase">Sanctuary</p>
            <div className="h-px w-8 bg-slate-100"></div>
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
            <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                {user?.premiumStatus?.isPremium && (
                  <div className="absolute -top-1.5 -right-1.5 p-0.5 bg-amber-400 rounded-full border border-white">
                    <Shield className="w-2 h-2 text-white fill-current" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate leading-none mb-1">{user?.name}</p>
                <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Mind Aware</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => { localStorage.removeItem("user"); localStorage.removeItem("token"); window.location.href = `/${locale}/login`; }}
              className="flex items-center gap-3 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 transition-all w-full rounded-xl hover:bg-rose-50/50"
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
          : "text-slate-500 hover:bg-slate-50 hover:text-teal-600"
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
