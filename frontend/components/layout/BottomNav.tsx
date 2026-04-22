"use client";

import { Home, Flame, Sparkles, Moon, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();
  const isProgressActive = pathname.includes("/plans") || pathname.includes("/streak") || pathname.includes("/journey");

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50">
      <nav className="w-full bg-white/95 backdrop-blur-xl border-t border-teal-100 px-2 py-2 flex justify-between items-center shadow-[0_-4px_20px_rgba(13,148,136,0.08)]">
        <NavButton href="/vi/home"     icon={<Home className="w-5 h-5" />}       label="Today"    isActive={pathname.includes("/home")} />
        <NavButton href="/vi/streak"   icon={<TrendingUp className="w-5 h-5" />} label="Progress" isActive={isProgressActive} />
        <NavButton href="/vi/ai-coach" icon={<Sparkles className="w-5 h-5" />}   label="AI Coach" isActive={pathname.includes("/ai-coach")} />
        <NavButton href="/vi/sleep"    icon={<Moon className="w-5 h-5" />}       label="Sleep"    isActive={pathname.includes("/sleep")} />
        <NavButton href="/vi/coaches"  icon={<Flame className="w-5 h-5" />}      label="Coaches"  isActive={pathname.includes("/coaches")} />
      </nav>
    </div>
  );
}

function NavButton({ href, icon, label, isActive = false }: {
  href: string; icon: React.ReactNode; label: string; isActive?: boolean;
}) {
  return (
    <Link href={href} className="flex-1">
      <div className={`flex flex-col items-center gap-1 py-1.5 rounded-xl mx-0.5 transition-colors ${
        isActive ? "text-teal-600 bg-teal-50" : "text-slate-400 hover:text-slate-600"
      }`}>
        {icon}
        <span className="text-[10px] font-medium leading-none">{label}</span>
      </div>
    </Link>
  );
}
