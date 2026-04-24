"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { AuthGateway } from "./AuthGateway";
import { useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    // We now show the AuthGateway modal instead of auto-redirecting
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0A0A0C]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="ml-3 text-white/50 text-xs uppercase tracking-widest">Loading...</span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0C]">
        <AuthGateway 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            router.back();
          }} 
        />
      </div>
    );
  }

  return <>{children}</>;
}
