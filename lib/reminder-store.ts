import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useServiceStore } from "./service-store"
import { supabase } from "@/lib/supabaseClient"

export type ReminderPriority = "high" | "medium" | "low"
export type ReminderStatus = "upcoming" | "future" | "completed"
export type NotificationType = "email" | "sms"

export type Reminder = {
  id: number;
  created_at: string;
  user_id: string;
  // Display fields (camelCase for app)
  carId: number;
  serviceType: string;
  dueDate: string;
  status: string;
  priority: string;
  notes: string;
  notificationSent: boolean;
  notificationTypes: string[];
  notificationSchedule: string;
  completedDate?: string;
  addedToServiceHistory: boolean;
}

type ReminderStore = {
  reminders: Reminder[];
  fetchReminders: () => Promise<void>;
  addReminder: (reminder: any) => Promise<number | null>;
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
    // Get current user ID from auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error("No authenticated user found")
      set({ reminders: [] })
      return
    }
    
    // Fetch only reminders belonging to the current user
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true })
    
    if (error) {
      console.error("Error fetching reminders:", error)
      set({ reminders: [] })
    } else if (data) {
      console.log(`Fetched ${data.length} reminders for user ${user.id}`)
      
      // Transform snake_case from database to camelCase for app
      const transformedReminders = data.map((r: any) => ({
        id: r.id,
        created_at: r.created_at,
        user_id: r.user_id,
        carId: r.car_id,
        serviceType: r.service_type,
        dueDate: r.due_date,
        status: r.status,
        priority: r.priority,
        notes: r.notes || '',
        notificationSent: r.notification_sent,
        notificationTypes: r.notification_types ? r.notification_types.split(',') : ['email'],
        notificationSchedule: r.notification_schedule,
        completedDate: r.completed_date,
        addedToServiceHistory: r.added_to_service_history
      }))
      
      set({ reminders: transformedReminders })
    }
  },
  addReminder: async (reminder) => {
    // Get current user to ensure user_id is set
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No authenticated user found");
      return null;
    }
    
    // Data is already in snake_case from add page, just add user_id
    const reminderData = {
      ...reminder,
      user_id: user.id
    };
    
    console.log("Adding reminder:", reminderData);
    
    const { data, error } = await supabase
      .from("reminders")
      .insert([reminderData])
      .select("id")
      .single();
    
    if (error) {
      console.error("Supabase insert error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      console.error("Reminder data:", reminderData);
      return null;
    }
    
    if (data) {
      console.log("Reminder created successfully:", data.id);
      
      // Send immediate confirmation email
      try {
        await fetch('/api/reminders/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reminderId: data.id,
            immediate: true
          })
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't fail the reminder creation if email fails
      }
      
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
    const reminder = get().reminders.find(r => r.id === id);
    if (!reminder) return;
    
    // Update reminder status
    await get().updateReminder(id, { 
      status: "completed", 
      completed_date: new Date().toISOString() 
    });
    
    // Automatically add to service history if not already added
    if (!reminder.added_to_service_history) {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Create service record from reminder
        const { error: serviceError } = await supabase.from("services").insert([{
          user_id: user.id,
          car_id: reminder.car_id,
          type: reminder.service_type,
          description: `Completed from reminder: ${reminder.service_type}`,
          date: new Date().toISOString().split('T')[0],
          cost: "0",
          mileage: "0",
          notes: reminder.notes || `Service completed on ${new Date().toLocaleDateString()}`,
          from_reminder: true,
          reminder_id: reminder.id.toString()
        }]);
        
        if (!serviceError) {
          // Mark reminder as added to service history
          await supabase.from("reminders").update({ 
            added_to_service_history: true 
          }).eq("id", id);
          
          console.log(`Service history automatically created from reminder ${id}`);
        } else {
          console.error("Error creating service history:", serviceError);
        }
      } catch (error) {
        console.error("Error auto-creating service history:", error);
      }
    }
  },
  markNotificationSent: async (id) => {
    await get().updateReminder(id, { notification_sent: true });
  },
  getRemindersByCarId: (carId) => {
    return get().reminders.filter((reminder) => reminder.carId === carId);
  },
  getRemindersByStatus: (status) => {
    return get().reminders.filter((reminder) => reminder.status === status);
  },
}))
