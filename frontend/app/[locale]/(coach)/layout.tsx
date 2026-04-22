import Link from "next/link";
import { LayoutDashboard, FileText, CalendarDays, Settings, LogOut } from "lucide-react";

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F2FBFA] text-slate-800 font-sans">
      
      {/* Coach Sidebar */}
      <aside className="w-64 border-r border-teal-100 hidden md:flex flex-col bg-white">
        <div className="p-6">
          <Link href="./../../home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm shadow-teal-500/20">
              <span className="text-white font-serif font-bold text-lg leading-none">O</span>
            </div>
            <span className="font-serif font-bold text-xl tracking-wide text-slate-800">Oasis<span className="text-teal-600">Coach</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold px-4 mb-4 mt-2">Management</div>
          
          <Link href="./coach" className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${true ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'} font-medium transition-colors`}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="?tab=content" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-teal-50/50 hover:text-teal-600 transition-colors font-medium">
            <FileText className="w-5 h-5" />
            My Meditations
          </Link>
          <Link href="?tab=live" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-teal-50/50 hover:text-teal-600 transition-colors font-medium">
            <CalendarDays className="w-5 h-5" />
            My Live Sessions
          </Link>
        </nav>
        
        <div className="p-6 border-t border-teal-50">
          <Link href="./login" className="flex items-center gap-3 text-rose-500 hover:text-rose-600 font-medium w-full px-4 py-3 rounded-2xl hover:bg-rose-50 transition-colors">
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
