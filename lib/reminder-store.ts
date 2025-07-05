import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useServiceStore } from "./service-store"
import { supabase } from "@/lib/supabaseClient"

export type ReminderPriority = "high" | "medium" | "low"
export type ReminderStatus = "upcoming" | "future" | "completed"
export type NotificationType = "email" | "sms"

export type Reminder = {
  id: number; // bigint
  created_at: string; // timestamp with time zone
  due_date: string; // date
  notification_sent: boolean;
  completed_date: string; // time without time zone
  added_to_service_history: boolean;
  car_id: number; // bigint
  notification_schedule: string;
  service_type: string;
  priority: string;
  status: string;
  notes: string;
  notification_types: string;
}

type ReminderStore = {
  reminders: Reminder[];
  fetchReminders: () => Promise<void>;
  addReminder: (reminder: Omit<Reminder, "id" | "created_at">) => Promise<number | null>;
  updateReminder: (id: number, reminder: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: number) => Promise<void>;
  markAsComplete: (id: number) => Promise<void>;
  markNotificationSent: (id: number) => Promise<void>;
  getRemindersByCarId: (carId: number) => Reminder[];
  getRemindersByStatus: (status: string) => Reminder[];
}

export const useReminderStore = create<ReminderStore>()((set, get) => ({
  reminders: [],
  fetchReminders: async () => {
    const { data, error } = await supabase.from("reminders").select("*");
    if (!error && data) {
      set({ reminders: data });
    }
  },
  addReminder: async (reminder) => {
    const { data, error } = await supabase.from("reminders").insert([reminder]).select("id").single();
    if (error) {
      console.error("Supabase insert error:", error);
    }
    if (!error && data) {
      await get().fetchReminders();
      return data.id;
    }
    return null;
  },
  updateReminder: async (id, updatedReminder) => {
    await supabase.from("reminders").update(updatedReminder).eq("id", id);
    await get().fetchReminders();
  },
  deleteReminder: async (id) => {
    await supabase.from("reminders").delete().eq("id", id);
    await get().fetchReminders();
  },
  markAsComplete: async (id) => {
    await get().updateReminder(id, { status: "completed" });
  },
  markNotificationSent: async (id) => {
    await get().updateReminder(id, { notification_sent: true });
  },
  getRemindersByCarId: (carId) => {
    return get().reminders.filter((reminder) => reminder.car_id === carId);
  },
  getRemindersByStatus: (status) => {
    return get().reminders.filter((reminder) => reminder.status === status);
  },
}))
