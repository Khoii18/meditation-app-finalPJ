"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push(`/vi/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoggedIn, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0A0A0C]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return <>{children}</>;
}
