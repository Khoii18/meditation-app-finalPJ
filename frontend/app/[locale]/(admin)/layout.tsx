"use client";

import Link from "next/link";
import { 
  LayoutDashboard, FileText, CalendarDays, Settings, LogOut, 
  Users, Smile, CreditCard, Mail, Moon, Layers, Music
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "content";

  const NavLink = ({ href, icon: Icon, label, tab }: any) => {
    const isActive = currentTab === tab;
    return (
      <Link 
        href={href} 
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
          isActive 
            ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20 font-bold' 
            : 'text-slate-500 hover:bg-teal-50 hover:text-teal-600 font-medium'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'}`} />
        <span className="text-sm">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFB] text-slate-800 font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-72 border-r border-slate-100 hidden md:flex flex-col bg-white sticky top-0 h-screen overflow-y-auto custom-scrollbar">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/20">
              <img src="/lunaria-logo.svg" alt="" className="w-6 h-6 brightness-0 invert" />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-slate-900">Lunaria<span className="text-teal-600">CMS</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-8">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black px-4 mb-3">Core</div>
            <NavLink href="./admin" icon={LayoutDashboard} label="Dashboard" tab="dashboard" />
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black px-4 mb-3">Content Library</div>
            <div className="space-y-1">
              <NavLink href="?tab=content" icon={FileText} label="Meditations" tab="content" />
              <NavLink href="?tab=soundscapes" icon={Music} label="Soundscapes" tab="soundscapes" />
              <NavLink href="?tab=sleep" icon={Moon} label="Sleep Stories" tab="sleep" />
              <NavLink href="?tab=plans" icon={Layers} label="Course Plans" tab="plans" />
              <NavLink href="?tab=routine" icon={CalendarDays} label="Daily Routine" tab="routine" />
            </div>
          </div>
          
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black px-4 mb-3">Community</div>
            <div className="space-y-1">
              <NavLink href="?tab=users" icon={Users} label="User Directory" tab="users" />
              <NavLink href="?tab=messages" icon={Mail} label="Support Center" tab="messages" />
              <NavLink href="?tab=emotions" icon={Smile} label="Mood Analytics" tab="emotions" />
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black px-4 mb-3">Finance</div>
            <NavLink href="?tab=payments" icon={CreditCard} label="Transactions" tab="payments" />
          </div>
        </nav>
        
        <div className="p-6 mt-8 border-t border-slate-50">
          <Link href="./login" className="flex items-center gap-3 text-rose-500 hover:text-rose-600 font-bold w-full px-4 py-4 rounded-2xl hover:bg-rose-50 transition-all text-sm">
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      <div className="flex-1 w-full mx-auto relative h-screen overflow-y-auto bg-slate-50/50">
        {children}
      </div>
    </div>
  );
}
