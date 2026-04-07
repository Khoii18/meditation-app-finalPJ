import { Home, Layers, PlayCircle, Moon, User } from "lucide-react";

export function BottomNav() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none">
      <nav className="w-full max-w-md bg-white dark:bg-[#1C1C1E] border-t border-slate-100 dark:border-white/5 px-6 py-3 flex justify-between items-center pointer-events-auto pb-safe">
        <NavButton icon={<Home className="w-6 h-6" />} label="Today" isActive />
        <NavButton icon={<Layers className="w-6 h-6" />} label="Plans" />
        <NavButton icon={<PlayCircle className="w-6 h-6" />} label="Singles" />
        <NavButton icon={<Moon className="w-6 h-6" />} label="Sleep" />
        <NavButton icon={<User className="w-6 h-6" />} label="Profile" />
      </nav>
    </div>
  );
}

function NavButton({ icon, label, isActive = false }: { icon: React.ReactNode, label: string, isActive?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"} transition-colors`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
