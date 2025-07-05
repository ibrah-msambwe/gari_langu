"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().fetchUser();
  }, []);
  return <>{children}</>;
} 