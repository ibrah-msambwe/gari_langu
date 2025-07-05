import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "./auth-store"
import { supabase } from "@/lib/supabaseClient"

export type UserPreferences = {
  language: "en" | "sw"
  darkMode: boolean
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

export type User = {
  id: string;
  is_admin: boolean;
  created_at: string;
  email_confirmed_at: string | null;
  invited_at: string | null;
  confirmation_sent_at: string | null;
  recovery_sent_at: string | null;
  email_change_sent_at: string | null;
  last_sign_in_at: string | null;
  raw_app_meta_data: any;
  raw_user_meta_data: any;
  is_super_admin: boolean;
  updated_at: string | null;
  phone_confirmed_at: string | null;
  phone_change_sent_at: string | null;
  confirmed_at: string | null;
  email_change_confirm_status: number | null;
  banned_until: string | null;
  reauthentication_sent_at: string | null;
  is_sso_user: boolean;
  deleted_at: string | null;
  is_anonymous: boolean;
  registration_date: string | null;
  trial_end_date: string | null;
  subscription_end_date: boolean | null;
  pending_payment: boolean | null;
  is_active: boolean;
  instance_id: string | null;
  name: string | null;
  email: string | null;
  password: string | null;
  phone: string | null;
  confirmation_token: string | null;
  is_subscribed: string | null;
  reauthentication_token: string | null;
  recovery_token: string | null;
  language: string | null;
  phone_change: string | null;
  email_change_token_new: string | null;
  avatar: string | null;
  email_change: string | null;
  phone_change_token: string | null;
  aud: string | null;
  role: string | null;
  encrypted_password: string | null;
  email_change_token_current: string | null;
}

type UserStore = {
  users: User[];
  fetchUsers: () => Promise<void>;
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  language: "en",
  darkMode: false,
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
}

// Make sure the initial state is properly set
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      fetchUsers: async () => {
        const { data, error } = await supabase.from("users").select("*");
        if (!error && data) {
          set({ users: data });
        }
      },
      preferences: defaultPreferences,
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        }))
      },
    }),
    {
      name: "user-preferences",
    },
  ),
)
