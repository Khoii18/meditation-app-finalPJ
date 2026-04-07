import { Sidebar } from "../../components/layout/Sidebar";
import { BottomNav } from "../../components/layout/BottomNav";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 md:ml-64 w-full mx-auto relative pb-20 md:pb-0">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
