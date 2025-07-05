"use client";
import { useRestoreSession } from "@/hooks/useRestoreSession";
import { useSupabaseAuthListener } from "@/hooks/useSupabaseAuthListener";

export function SessionRestorer() {
  useRestoreSession();
  useSupabaseAuthListener();
  return null;
} 