"use client";

import { SleepHeader } from "./components/SleepHeader";
import { SleepSounds } from "./components/SleepSounds";
import { SleepStories } from "./components/SleepStories";

export default function SleepPage() {
  return (
    <div className="w-full min-h-screen bg-[#111115] text-white">
      {/* Subtle blue/teal dark glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#182330]/80 to-transparent z-0 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-12 pb-28 md:pb-16 relative z-10">
        <SleepHeader />
        <SleepSounds />
        <SleepStories />
      </div>
    </div>
  );
}
