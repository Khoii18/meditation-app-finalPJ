"use client";

import { SleepHeader } from "./components/SleepHeader";
import { SleepSounds } from "./components/SleepSounds";
import { SleepStories } from "./components/SleepStories";

export default function SleepPage() {
  return (
    <div className="w-full min-h-screen bg-[#0A0A0C] text-white">
      {/* Background element */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-900/30 to-[#0A0A0C] z-0 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-24 relative z-10">
        <SleepHeader />
        <SleepSounds />
        <SleepStories />
      </div>
    </div>
  );
}
