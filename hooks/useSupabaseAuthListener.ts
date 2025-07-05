"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/lib/auth-store";

export function useSupabaseAuthListener() {
  const { fetchUser } = useAuthStore();
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      fetchUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [fetchUser]);
} 