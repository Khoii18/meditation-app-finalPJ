import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { OnboardingModal } from "@/components/auth/OnboardingModal";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F2FBFA] text-slate-900 font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 w-full min-w-0 max-w-[100vw] md:max-w-none overflow-x-hidden relative pb-20 md:pb-0 mx-auto">
        {children}
      </main>
      <BottomNav />
      <OnboardingModal />
    </div>
  );
}
