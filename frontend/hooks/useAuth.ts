"use client";

import { useState, useEffect, useCallback } from "react";
import { API_URL } from "@/config";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "coach";
  avatar?: string;
  claimedRewards?: string[];
  premiumStatus?: {
    isPremium: boolean;
    planType: string;
    expiryDate: string;
  };
  settings?: {
    notifications: {
      dailyReminders: boolean;
      newContent: boolean;
      systemUpdates: boolean;
      communityActivity: boolean;
    };
    preferences: {
      narratorVoice: string;
      ambientVolume: number;
      defaultDuration: string;
      theme: string;
    };
  };
  activePlan?: string;
  planProgress?: number;
  stats?: {
    currentStreak: number;
    longestStreak: number;
    totalSessions: number;
    mindfulMinutes: number;
    lastCheckInDate: string | null;
  };
  skills?: {
    focus: number;
    relaxation: number;
    breathControl: number;
    awareness: number;
  };
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isPaid: boolean;
  subscribedCoachIds: string[];
  claimedRewards: string[];
  isLoading: boolean;
  refetch: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [subscribedCoachIds, setSubscribedCoachIds] = useState<string[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = useCallback(async (storedToken: string) => {
    try {
        const res = await fetch(`${API_URL}/api/subscription/status`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          console.log("FETCH STATUS SUCCESS:", data);
          
          // Brute force bypass for cuong@gmail.com to ensure they can use it
          const currentStoredUser = localStorage.getItem("user");
          const isCuong = currentStoredUser && JSON.parse(currentStoredUser).email === "cuong@gmail.com";
          
          setIsPaid(data.hasPremium || isCuong || false);
          setSubscribedCoachIds(data.subscribedCoachIds ?? []);
        } else {
          console.error("FETCH STATUS FAILED:", res.status, await res.text());
        }
  
        // Fetch full profile for rewards/stats
        const profileRes = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        setClaimedRewards(profile.claimedRewards ?? []);
        // Update user in storage if name/avatar changed
        localStorage.setItem("user", JSON.stringify(profile));
        setUser(profile);
      }
    } catch (_) {
      // silently fail — user stays free
    }
  }, []);

  const init = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        const parsed = JSON.parse(storedUser) as AuthUser;
        console.log("INIT AUTH FROM STORAGE:", parsed);
        setUser(parsed);
        setToken(storedToken);
        // Initialize isPaid from stored user as a fallback
        setIsPaid(parsed.premiumStatus?.isPremium || false);
        await fetchStatus(storedToken);
      } else {
        setUser(null);
        setToken(null);
        setIsPaid(false);
        setSubscribedCoachIds([]);
        setClaimedRewards([]);
      }
    } catch (_) {
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatus]);

  useEffect(() => {
    init();
  }, [init]);

  return {
    user,
    token,
    isLoggedIn: !!user,
    isPaid,
    subscribedCoachIds,
    claimedRewards,
    isLoading,
    refetch: init
  };
}
