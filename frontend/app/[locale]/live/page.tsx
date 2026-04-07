"use client";

import { LivePlayer } from "./components/LivePlayer";
import { LiveSchedule } from "./components/LiveSchedule";

export default function LivePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 xl:px-12 pb-10">
      <header className="py-8">
        <h1 className="text-3xl font-serif font-medium text-slate-800 dark:text-slate-100">Live Studio</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Join real-time guided meditation sessions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LivePlayer />
        <LiveSchedule />
      </div>
    </div>
  );
}
