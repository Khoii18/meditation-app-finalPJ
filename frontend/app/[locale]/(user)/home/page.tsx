"use client";

import { Header } from "./components/Header";
import { DailyHero } from "./components/DailyHero";
import { SinglesList } from "./components/SinglesList";
import { LiveSessions } from "./components/LiveSessions";
import { MoodJournal } from "./components/MoodJournal";
import { DailyCheckInModal } from "./components/DailyCheckInModal";

export default function HomeDashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 xl:px-12 pb-28 md:pb-10">
      <Header />
      <DailyCheckInModal />
      
      <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Hero) */}
        <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
          <DailyHero />
          <SinglesList />
        </div>

        {/* Right Column (Live & Sidebar Stats) */}
        <div className="lg:col-span-1 pt-0 lg:pt-0 flex flex-col gap-6 md:gap-8">
          <MoodJournal />
          <LiveSessions />
        </div>
      </main>
    </div>
  );
}


