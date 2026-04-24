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
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-10 pb-28 md:pb-10 transition-all duration-500">
      <Header />
      <DailyCheckInModal />
      
      <main className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
        {/* Left Column (Hero & Content) */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8">
          <DailyHero />
          <SinglesList />
        </div>

        {/* Right Column (Sidebar Stats & AI) */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 md:gap-8 sticky top-6 self-start">
          <ContinueJourney />
          <MoodJournal />
          <MiniAIChat />
        </div>
      </main>
    </div>
  );
}
