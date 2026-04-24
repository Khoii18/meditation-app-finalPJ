import Link from "next/link";
import { 
  LayoutDashboard, LogOut, FileText, Users, 
  Settings, ShieldCheck, Sparkles, Lock, Moon 
} from "lucide-react";

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
          <Link href="./../../home" className="flex items-center gap-3">
            <img src="/lunaria-logo.svg" alt="" className="w-8 h-8" />
            <span className="font-serif font-medium text-xl tracking-wide text-slate-800">Lunaria<span className="text-[#8B5CF6]">Coach</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-8">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold px-4 mb-4">Management</div>
            <Link href="./coach" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-teal-50 text-teal-700 font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          </div>

          <div className="px-4 space-y-6">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">Coach Guidelines</div>
            
            <div className="space-y-5">
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-5">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wider">Quality Standard</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">All meditation and relaxation content must be original and high-fidelity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Sparkles className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wider">Zen Atmosphere</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">Maintain a peaceful, respectful tone in all interactions and descriptions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Lock className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wider">Student Privacy</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">Direct contact or soliciting student data outside the platform is prohibited.</p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 rounded-2xl bg-teal-500/5 border border-teal-500/10">
                <p className="text-xs text-teal-600 dark:text-teal-400 font-medium leading-relaxed italic">
                  "Your guidance is a sanctuary. Keep it pure, keep it mindful."
                </p>
              </div>
            </div>
          </div>
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
