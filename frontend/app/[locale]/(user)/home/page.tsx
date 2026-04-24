"use client";

import { Header } from "./components/Header";
import { DailyHero } from "./components/DailyHero";
import { SinglesList } from "./components/SinglesList";
import { MoodJournal } from "./components/MoodJournal";
import { DailyCheckInModal } from "./components/DailyCheckInModal";
import { ContinueJourney } from "./components/ContinueJourney";
import { MiniAIChat } from "./components/MiniAIChat";

export default function HomeDashboard() {
  return (
    <div className="w-full h-screen mx-auto px-4 md:px-6 overflow-hidden flex flex-col transition-all duration-700 bg-background/50">
      <Header />
      <DailyCheckInModal />
      
      <main className="flex-1 mt-2 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden pb-4">
        {/* Left Column (Hero & Content) */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-4 overflow-hidden">
          <div className="flex-shrink-0">
            <DailyHero />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-hide">
            <SinglesList />
          </div>
        </div>

        {/* Right Column (Sidebar Stats & AI) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-4 overflow-hidden h-full">
          <div className="flex-shrink-0">
            <ContinueJourney />
          </div>
          <div className="flex-shrink-0">
            <MoodJournal />
          </div>
          <div className="flex-1 min-h-0 flex flex-col">
            <MiniAIChat />
          </div>
        </div>
      </main>
    </div>
  );
}
