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
    <div className="w-full min-h-screen md:h-screen mx-auto px-4 md:px-6 overflow-y-auto md:overflow-hidden flex flex-col transition-all duration-700 bg-background/50 scrollbar-hide">
      <Header />
      <DailyCheckInModal />
      
      <main className="flex-1 mt-2 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 md:pb-4">
        {/* Left Column (Hero & Content) */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-6 md:gap-4">
          <div className="flex-shrink-0">
            <DailyHero />
          </div>
          <div className="flex-1 min-h-0 md:overflow-y-auto pr-0 md:pr-2 scrollbar-hide">
            <SinglesList />
          </div>
        </div>

        {/* Right Column (Sidebar Stats & AI) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6 md:gap-4 h-full">
          <div className="flex-shrink-0">
            <ContinueJourney />
          </div>
          <div className="flex-shrink-0">
            <MoodJournal />
          </div>
          <div className="md:flex-1 min-h-[400px] md:min-h-0 flex flex-col pb-4">
            <MiniAIChat />
          </div>
        </div>
      </main>
    </div>
  );
}
