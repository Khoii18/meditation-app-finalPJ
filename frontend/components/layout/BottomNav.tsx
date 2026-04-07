"use client";

import { Home, Flame, PlayCircle, CreditCard, User, Sparkles, Moon, Map as MapIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none pb-safe">
      <nav className="w-full bg-white/90 dark:bg-[#0A0A0C]/90 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 px-2 py-4 flex justify-between items-center pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <NavButton href="/vi/home" icon={<Home className="w-5 h-5 md:w-6 md:h-6" />} label="Today" isActive={pathname.includes("/home")} />
        <NavButton href="/vi/journey" icon={<MapIcon className="w-5 h-5 md:w-6 md:h-6" />} label="Journey" isActive={pathname.includes("/journey")} />
        <NavButton href="/vi/streak" icon={<Flame className="w-5 h-5 md:w-6 md:h-6" />} label="Streak" isActive={pathname.includes("/streak")} />
        <NavButton href="/vi/ai-coach" icon={<Sparkles className="w-5 h-5 md:w-6 md:h-6" />} label="AI" isActive={pathname.includes("/ai-coach")} />
        <NavButton href="/vi/profile" icon={<User className="w-5 h-5 md:w-6 md:h-6" />} label="Profile" isActive={pathname.includes("/profile")} />
      </nav>
    </div>
  );
}

function NavButton({ href, icon, label, isActive = false }: { href: string, icon: React.ReactNode, label: string, isActive?: boolean }) {
  return (
    <Link href={href} className="flex-1">
      <div className={`flex flex-col items-center gap-1.5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"} transition-colors`}>
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
      </div>
    </Link>
  );
}
