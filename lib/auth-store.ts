import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useEffect } from "react"
import { useNotificationStore } from "./notification-store"
import { supabase } from "@/lib/supabaseClient"

export type PaymentStatus = "pending" | "verified" | "rejected"

export interface PaymentRecord {
  id: number; // bigint
  created_at: string; // timestamp with time zone
  date: string; // date
  user_id: number; // bigint
  method: string | null;
  months: string | null;
  status: string | null;
  transaction_id: string | null;
  verification_message: string | null;
  verification_image: string | null;
  amount: string | null;
  admin_notes: string | null;
}

export interface User {
  id: string; // uuid
  email: string | null;
  is_admin?: boolean;
}

// Helper function to create a trial end date (7 days from now)
const createTrialEndDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString()
}

// Helper function to generate a unique ID
const generateId = (items: { id: number }[]) => {
  return items.length > 0 ? Math.max(...items.map((item) => Number(item.id))) + 1 : 1;
}

type AuthStore = {
  user: User | null;
  session: any;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTrialActive: boolean;
  trialEnd: string | null;
  isRestricted: boolean;
  isSubscribed: boolean;
  subscriptionEndDate: string | null;
  login: (email: string, password: string) => Promise<{ error: any } | { user: User }>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(persist((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isAdmin: false,
  isTrialActive: false,
  trialEnd: null,
  isRestricted: false,
  isSubscribed: false,
  subscriptionEndDate: null,
  login: async (email, password) => {
    console.log("[AuthStore] Login attempt for:", email);
    
    // Fallback local admin for development
    if (email === "msambwe2@gmail.com" && password === "Msambwe@4687") {
      console.log("[AuthStore] Using local admin fallback");
      set({
        user: { id: "local-admin", email: email as string | null },
        session: null,
        isAuthenticated: true,
        isAdmin: true,
        isTrialActive: true,
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isSubscribed: true,
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isRestricted: false,
      });
      return { user: { id: "local-admin", email: email as string | null } };
    }
    
    // Supabase Auth login
    console.log("[AuthStore] Attempting Supabase Auth login...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.log("[AuthStore] Supabase Auth error:", error);
      console.log("[AuthStore] Error details:", {
        message: error.message,
        status: error.status,
        name: error.name
      });
      set({ user: null, session: null, isAuthenticated: false, isAdmin: false, isTrialActive: false, trialEnd: null, isSubscribed: false, subscriptionEndDate: null, isRestricted: false });
      return { error };
    }
    
    if (data.user) {
      console.log("[AuthStore] Supabase Auth successful, user ID:", data.user.id);
      
      // Fetch profile from users table
      console.log("[AuthStore] Fetching user profile from users table...");
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('is_admin, trial_end, is_active, is_subscribed, subscription_end_date')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.log("[AuthStore] Profile fetch error:", profileError);
        set({ user: null, session: null, isAuthenticated: false, isAdmin: false, isTrialActive: false, trialEnd: null, isSubscribed: false, subscriptionEndDate: null, isRestricted: false });
        return { error: { message: 'Profile not found. Please contact support.' } };
      }
      
      console.log("[AuthStore] Profile found:", profile);
      
      let trialEnd = profile?.trial_end ?? null;
      if (typeof trialEnd === 'undefined') trialEnd = null;
      const isTrialActive = trialEnd ? new Date() < new Date(trialEnd) : false;
      
      // Check is_active
      const isActive = profile?.is_active ?? true;
      const isSubscribed = profile?.is_subscribed ?? false;
      const subscriptionEndDate: string | null = (profile?.subscription_end_date ?? null) as string | null;
      
      console.log("[AuthStore] Trial end:", trialEnd);
      console.log("[AuthStore] Is trial active:", isTrialActive);
      console.log("[AuthStore] Is active:", isActive);
      console.log("[AuthStore] Is subscribed:", isSubscribed);
      
      // If trial is expired and user is not active, block login
      if (!isTrialActive && !isActive) {
        console.log("[AuthStore] Login blocked: trial expired and user not active");
        set({ user: null, session: null, isAuthenticated: false, isAdmin: false, isTrialActive: false, trialEnd: null, isSubscribed: false, subscriptionEndDate: null, isRestricted: false });
        return { error: { message: 'Your account has been deactivated. Please contact support.' } };
      }
      
      // Allow login if trial is active, or if trial is expired but user is active
      console.log("[AuthStore] Login successful, setting user state");
      set({
        user: { id: data.user.id, email: (data.user.email ?? null) },
        session: data.session,
        isAuthenticated: true,
        isAdmin: profile?.is_admin === true,
        isTrialActive,
        trialEnd,
        isSubscribed,
        subscriptionEndDate,
        // Add a new flag to restrict access if not in trial and not subscribed
        isRestricted: !isTrialActive && !isSubscribed,
      });
      
      // If trial is active, create a reminder
      if (isTrialActive) {
        console.log("[AuthStore] Creating trial reminder");
        await supabase.from('reminders').insert([
          {
            user_id: data.user.id,
            message: "You are using a free trial. Some features will not work until you subscribe.",
            created_at: new Date().toISOString(),
          }
        ]);
      }
      
      return { user: { id: data.user.id, email: (data.user.email ?? null) } };
    }
    
    console.log("[AuthStore] No user data returned from Supabase Auth");
    set({ user: null, session: null, isAuthenticated: false, isAdmin: false, isTrialActive: false, trialEnd: null, isSubscribed: false, subscriptionEndDate: null, isRestricted: false });
    return { error: { message: 'Unknown error' } };
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isAuthenticated: false, isAdmin: false, isTrialActive: false, trialEnd: null });
  },
  fetchUser: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      set({
        user: { id: data.user.id, email: data.user.email },
        isAuthenticated: true,
        isAdmin: data.user.email === "msambwe2@gmail.com",
      });
    } else {
      set({ user: null, isAuthenticated: false, isAdmin: false });
    }
  },
}), {
  name: "auth-store",
}))

// Restore Supabase session on app load
export function useRestoreSession() {
  const { fetchUser } = useAuthStore()
  useEffect(() => {
    fetchUser()
  }, [fetchUser])
}
