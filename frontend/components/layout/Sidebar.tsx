"use client";

import { Home, Flame, PlayCircle, CreditCard, User, LogOut, Sparkles, Moon, Map as MapIcon, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-white dark:bg-[#0A0A0C] border-r border-slate-100 dark:border-white/5 py-8 px-6 z-40">
      <div className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-white font-bold text-sm">O</span>
        </div>
        <span className="font-serif font-semibold text-xl tracking-tight text-slate-800 dark:text-white">Oasis</span>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem href="/vi/home" icon={<Home className="w-5 h-5" />} label="Today" isActive={pathname.includes("/home")} />
        <NavItem href="/vi/plans" icon={<MapIcon className="w-5 h-5" />} label="Plans" isActive={pathname.includes("/plans")} />
        <NavItem href="/vi/journey" icon={<MapIcon className="w-5 h-5" />} label="Journey" isActive={pathname.includes("/journey")} />
        <NavItem href="/vi/streak" icon={<Flame className="w-5 h-5" />} label="Streak" isActive={pathname.includes("/streak")} />
        <NavItem href="/vi/ai-coach" icon={<Sparkles className="w-5 h-5" />} label="AI Coach" isActive={pathname.includes("/ai-coach")} />
        <NavItem href="/vi/coaches" icon={<Users className="w-5 h-5" />} label="Coaches" isActive={pathname.includes("/coaches")} />
        <NavItem href="/vi/sleep" icon={<Moon className="w-5 h-5" />} label="Sleep" isActive={pathname.includes("/sleep")} />
        <NavItem href="/vi/pricing" icon={<CreditCard className="w-5 h-5" />} label="Pricing" isActive={pathname.includes("/pricing")} />
        <NavItem href="/vi/profile" icon={<User className="w-5 h-5" />} label="Profile" isActive={pathname.includes("/profile")} />
      </nav>

      <div className="mt-auto">
        <button 
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/vi/login";
          }}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors w-full rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-500/10"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, isActive = false }: { href: string, icon: React.ReactNode, label: string, isActive?: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
        isActive 
          ? "bg-slate-100 dark:bg-white/10 text-indigo-600 dark:text-indigo-400 font-semibold" 
          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-medium"
      }`}>
        <div className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-current"}>
          {icon}
        </div>
        <span>{label}</span>
      </div>
    </Link>
  );
}
