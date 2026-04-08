"use client";

import { ProfileHeader } from "./components/ProfileHeader";
import { ThrivingTree } from "./components/ThrivingTree";
import { SettingsGroup } from "./components/SettingsGroup";

export default function ProfilePage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-24">
      <ProfileHeader />
      <ThrivingTree />
      <SettingsGroup />
    </div>
  );
}
