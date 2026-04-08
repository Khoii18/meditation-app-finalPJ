"use client";

import { Settings, Moon, Bell, Shield, CircleHelp } from "lucide-react";

export function SettingsGroup() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Settings</h3>
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden">
          <SettingRow icon={<Moon className="w-5 h-5"/>} title="Appearance" subtitle="Light mode" />
          <div className="h-px bg-slate-100 dark:bg-white/5" />
          <SettingRow icon={<Bell className="w-5 h-5"/>} title="Notifications" subtitle="Daily reminders & Live alerts" />
          <div className="h-px bg-slate-100 dark:bg-white/5" />
          <SettingRow icon={<Settings className="w-5 h-5"/>} title="Preferences" subtitle="Voice, sound, length" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Support</h3>
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden">
          <SettingRow icon={<Shield className="w-5 h-5"/>} title="Privacy Policy" subtitle="Your data remains yours" />
          <div className="h-px bg-slate-100 dark:bg-white/5" />
          <SettingRow icon={<CircleHelp className="w-5 h-5"/>} title="Help Center" subtitle="Contact us for any issues" />
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
      <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-slate-800 dark:text-slate-100">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="text-slate-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </div>
    </div>
  );
}
