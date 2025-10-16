import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useEffect } from "react"
import { useNotificationStore } from "./notification-store"
import { supabase } from "./supabaseClient"

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
  name?: string;
  phone?: string;
  avatar?: string;
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
  currentUser: User | null;
  session: any;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTrialActive: boolean;
  trialEnd: string | null;
  isRestricted: boolean;
  isSubscribed: boolean;
  subscriptionEndDate: string | null;
  payments: PaymentRecord[];
  users: User[];
  login: (email: string, password: string) => Promise<{ error: any } | { user: User }>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  addPayment: (payment: Partial<PaymentRecord>) => Promise<void>;
  updatePaymentStatus: (paymentId: number, status: PaymentStatus, adminNotes?: string) => Promise<void>;
  getPaymentsByUserId: (userId: string) => PaymentRecord[];
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  fetchPayments: () => Promise<void>;
  fetchUsers: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(persist((set, get) => ({
  user: null,
  currentUser: null,
  session: null,
  isAuthenticated: false,
  isAdmin: false,
  isTrialActive: false,
  trialEnd: null,
  isRestricted: false,
  isSubscribed: false,
  subscriptionEndDate: null,
  payments: [],
  users: [],
  login: async (email, password) => {
    console.log("[AuthStore] Login attempt for:", email);
    
    // Fallback local admin for development
    if (email === "msambwe2@gmail.com" && password === "Msambwe@4687") {
      console.log("[AuthStore] Using local admin fallback");
      const adminUser = { 
        id: "local-admin", 
        email: email as string | null, 
        is_admin: true,
        name: "Administrator",
        phone: null,
        avatar: null
      };
      set({
        user: adminUser,
        currentUser: adminUser,
        session: null,
        isAuthenticated: true,
        isAdmin: true,
        isTrialActive: true,
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isSubscribed: true,
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isRestricted: false,
      });
      return { user: adminUser };
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
      
      // Provide more helpful error messages
      let userFriendlyMessage = error.message;
      if (error.message.includes("Invalid login credentials")) {
        userFriendlyMessage = "Incorrect email or password. Please check your credentials and try again.";
      } else if (error.message.includes("Email not confirmed")) {
        userFriendlyMessage = "Please check your email and confirm your account before logging in.";
      } else if (error.message.includes("User not found")) {
        userFriendlyMessage = "No account found with this email. Please register first.";
      }
      
      set({ user: null, session: null, isAuthenticated: false, isAdmin: false, isTrialActive: false, trialEnd: null, isSubscribed: false, subscriptionEndDate: null, isRestricted: false });
      return { error: { ...error, message: userFriendlyMessage } };
    }
    
    if (data.user) {
      console.log("[AuthStore] Supabase Auth successful, user ID:", data.user.id);
      
      // Fetch profile from users table
      console.log("[AuthStore] Fetching user profile from users table...");
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('is_admin, trial_end, is_active, is_subscribed, subscription_end_date, name, phone, avatar')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.log("[AuthStore] Profile fetch error:", profileError);
        
        // If profile doesn't exist, create it (this handles users who registered before profile creation)
        if (profileError.code === 'PGRST116') {
          console.log("[AuthStore] Profile not found, creating new profile...");
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 7);
          
          const { error: createError } = await supabase.from('users').insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
              phone: data.user.user_metadata?.phone || null,
              trial_end: trialEnd.toISOString(),
              is_active: true,
              is_subscribed: false,
              subscription_end_date: null,
              is_admin: false
            }
          ]);
          
          if (!createError) {
            console.log("[AuthStore] Profile created successfully, retrying login...");
            // Retry fetching the profile
            const { data: newProfile } = await supabase
              .from('users')
              .select('is_admin, trial_end, is_active, is_subscribed, subscription_end_date, name, phone, avatar')
              .eq('id', data.user.id)
              .single();
            
            if (newProfile) {
              // Continue with login using the new profile
              const userObj = { 
                id: data.user.id, 
                email: (data.user.email ?? null),
                is_admin: newProfile?.is_admin === true,
                name: newProfile?.name ?? data.user.email ?? 'User',
                phone: newProfile?.phone,
                avatar: newProfile?.avatar
              };
              
              const isTrialActive = newProfile?.trial_end ? new Date() < new Date(newProfile.trial_end) : false;
              const isSubscribed = newProfile?.is_subscribed ?? false;
              
              set({
                user: userObj,
                currentUser: userObj,
                session: data.session,
                isAuthenticated: true,
                isAdmin: newProfile?.is_admin === true,
                isTrialActive,
                trialEnd: newProfile?.trial_end ?? null,
                isSubscribed,
                subscriptionEndDate: newProfile?.subscription_end_date ?? null,
                isRestricted: !isTrialActive && !isSubscribed,
              });
              
              return { user: { id: data.user.id, email: (data.user.email ?? null) } };
            }
          }
        }
        
        set({ user: null, session: null, isAuthenticated: false, isAdmin: false, isTrialActive: false, trialEnd: null, isSubscribed: false, subscriptionEndDate: null, isRestricted: false });
        return { error: { message: 'Unable to load profile. Please try again or contact support.' } };
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
      const userObj = { 
        id: data.user.id, 
        email: (data.user.email ?? null),
        is_admin: profile?.is_admin === true,
        name: profile?.name ?? data.user.email ?? 'User',
        phone: profile?.phone,
        avatar: profile?.avatar
      };
      set({
        user: userObj,
        currentUser: userObj,
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
    set({ user: null, currentUser: null, session: null, isAuthenticated: false, isAdmin: false, isTrialActive: false, trialEnd: null, isSubscribed: false, subscriptionEndDate: null, isRestricted: false });
  },
  fetchUser: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      // Fetch complete profile
      const { data: profile } = await supabase
        .from('users')
        .select('is_admin, trial_end, is_active, is_subscribed, subscription_end_date, name, phone, avatar')
        .eq('id', data.user.id)
        .single();
      
      const userObj = {
        id: data.user.id,
        email: data.user.email,
        is_admin: profile?.is_admin === true,
        name: profile?.name ?? data.user.email ?? 'User',
        phone: profile?.phone,
        avatar: profile?.avatar
      };
      
      set({
        user: userObj,
        currentUser: userObj,
        isAuthenticated: true,
        isAdmin: profile?.is_admin === true,
        isTrialActive: profile?.trial_end ? new Date() < new Date(profile.trial_end) : false,
        trialEnd: profile?.trial_end ?? null,
        isSubscribed: profile?.is_subscribed ?? false,
        subscriptionEndDate: profile?.subscription_end_date ?? null,
        isRestricted: !(profile?.trial_end && new Date() < new Date(profile.trial_end)) && !profile?.is_subscribed,
      });
    } else {
      set({ user: null, currentUser: null, isAuthenticated: false, isAdmin: false });
    }
  },
  addPayment: async (payment) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const paymentData = {
      user_id: user.id,
      date: new Date().toISOString().split('T')[0],
      method: payment.method || 'mpesa',
      months: payment.months?.toString() || '1',
      status: 'pending',
      transaction_id: payment.transaction_id || '',
      verification_message: payment.verification_message || '',
      verification_image: payment.verification_image || null,
      amount: payment.amount?.toString() || '0',
      admin_notes: null,
      ...payment
    };

    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single();

    if (!error && data) {
      set((state) => ({
        payments: [...state.payments, data]
      }));
    }
  },
  updatePaymentStatus: async (paymentId, status, adminNotes) => {
    const { error } = await supabase
      .from('payments')
      .update({ status, admin_notes: adminNotes })
      .eq('id', paymentId);

    if (!error) {
      // Update local state
      set((state) => ({
        payments: state.payments.map(p => 
          p.id === paymentId 
            ? { ...p, status, admin_notes: adminNotes }
            : p
        )
      }));

      // If payment is verified, update user's subscription
      if (status === 'verified') {
        const payment = get().payments.find(p => p.id === paymentId);
        if (payment) {
          const months = parseInt(payment.months || '1');
          const newEndDate = new Date();
          newEndDate.setMonth(newEndDate.getMonth() + months);
          
          // Update user's subscription in database
          await supabase
            .from('users')
            .update({
              is_subscribed: true,
              subscription_end_date: newEndDate.toISOString()
            })
            .eq('id', payment.user_id);

          console.log(`✅ Subscription extended for user ${payment.user_id} until ${newEndDate.toISOString()}`);
        }
      }
    }
  },
  getPaymentsByUserId: (userId) => {
    return get().payments.filter(p => p.user_id === userId);
  },
  updateUser: async (userId, updates) => {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (!error) {
      set((state) => ({
        users: state.users.map(u => 
          u.id === userId 
            ? { ...u, ...updates }
            : u
        )
      }));
    }
  },
  deleteUser: async (userId) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (!error) {
      set((state) => ({
        users: state.users.filter(u => u.id !== userId)
      }));
    }
  },
  fetchPayments: async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ payments: data });
    }
  },
  fetchUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ users: data });
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
