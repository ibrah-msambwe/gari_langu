"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function useRestoreSession() {
  const { fetchUser } = useAuthStore();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
} 