import Link from "next/link";
import { LayoutDashboard, FileText, CalendarDays, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0A0A0C] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-white/10 hidden md:flex flex-col bg-white dark:bg-[#1C1C1E]">
        <div className="p-6">
          <Link href="./../../home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg leading-none">M</span>
            </div>
            <span className="font-serif font-bold text-xl tracking-wide">Mindful<span className="text-indigo-500">CMS</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-bold px-4 mb-4 mt-2">Management</div>
          
          <Link href="./admin" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-medium">
            <FileText className="w-5 h-5" />
            Meditations
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-medium">
            <CalendarDays className="w-5 h-5" />
            Live Schedule
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-medium">
            <Settings className="w-5 h-5" />
            Settings
          </a>
        </nav>
        
        <div className="p-6 border-t border-slate-200 dark:border-white/10">
          <Link href="./login" className="flex items-center gap-3 text-rose-500 hover:text-rose-600 font-medium w-full px-4 py-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      <div className="flex-1 w-full mx-auto relative overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}
