"use client";

import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "coach";
  avatar?: string;
  claimedRewards?: string[];
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
      const res = await fetch("http://localhost:5000/api/subscription/status", {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsPaid(data.hasPremium ?? false);
        setSubscribedCoachIds(data.subscribedCoachIds ?? []);
      }

      // Fetch full profile for rewards/stats
      const profileRes = await fetch("http://localhost:5000/api/users/me", {
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

  const init = useCallback(() => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        const parsed = JSON.parse(storedUser) as AuthUser;
        setUser(parsed);
        setToken(storedToken);
        fetchStatus(storedToken);
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
