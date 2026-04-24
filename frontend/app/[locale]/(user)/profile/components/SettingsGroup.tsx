"use client";

import { Settings, Moon, Bell, Shield, CircleHelp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { NotificationModal } from "@/components/modals/NotificationModal";

export function SettingsGroup() {
  const params = useParams();
  const locale = params.locale || 'vi';
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Settings</h3>
        <div className="bg-surface rounded-3xl border border-border overflow-hidden">
          <SettingRow href={`/${locale}/profile/appearance`} icon={<Moon className="w-5 h-5"/>} title="Appearance" subtitle="Light mode" />
          <div className="h-px bg-border" />
          <button onClick={() => setIsNotifOpen(true)} className="w-full text-left outline-none">
            <SettingRowStatic icon={<Bell className="w-5 h-5"/>} title="Notifications" subtitle="Daily reminders & Live alerts" />
          </button>
          <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          <div className="h-px bg-border" />
          <SettingRow href={`/${locale}/profile/preferences`} icon={<Settings className="w-5 h-5"/>} title="Preferences" subtitle="Voice, sound, length" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Support</h3>
        <div className="bg-surface rounded-3xl border border-border overflow-hidden">
          <SettingRow href={`/${locale}/profile/privacy-policy`} icon={<Shield className="w-5 h-5"/>} title="Privacy Policy" subtitle="Your data remains yours" />
          <div className="h-px bg-slate-100 dark:bg-white/5" />
          <SettingRow href={`/${locale}/profile/help-center`} icon={<CircleHelp className="w-5 h-5"/>} title="Help Center" subtitle="Contact us for any issues" />
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, title, subtitle, href }: { icon: React.ReactNode, title: string, subtitle: string, href: string }) {
  return (
    <Link href={href}>
      <SettingRowStatic icon={icon} title={title} subtitle={subtitle} />
    </Link>
  );
}

function SettingRowStatic({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="flex items-center justify-between p-5 hover:bg-background cursor-pointer transition-colors w-full">
      <div className="flex items-center gap-4 text-foreground">
        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="text-xs text-muted mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="text-muted opacity-50">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </div>
    </div>
  );
}
