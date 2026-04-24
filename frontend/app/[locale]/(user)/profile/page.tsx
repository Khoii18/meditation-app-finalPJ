"use client";

import { ProfileHeader } from "./components/ProfileHeader";
import { ThrivingTree } from "./components/ThrivingTree";
import { SettingsGroup } from "./components/SettingsGroup";
import { useState, useEffect } from "react";
import { API_URL } from "@/config";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_URL}/api/users/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setUser(await res.json());
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-24">
      <ProfileHeader />
      <ThrivingTree />
      <SettingsGroup user={user} onUserUpdate={setUser} />
    </div>
  );
}
