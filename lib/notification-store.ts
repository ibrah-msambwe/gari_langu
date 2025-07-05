import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabaseClient"

export type NotificationType = "email" | "sms" | "system"
export type NotificationPriority = "low" | "medium" | "high"
export type NotificationStatus = "unread" | "read"

export interface Notification {
  id: number; // bigint
  created_at: string; // timestamp with time zone
  user_id: number; // bigint
  read_at: string; // date
  type: string;
  title: string;
  message: string;
  priority: string;
  recipient_type: string;
  status: string;
}

type NotificationStore = {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, "id" | "created_at">) => Promise<number | null>;
  updateNotification: (id: number, notification: Partial<Notification>) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: (recipientType: string, userId?: number) => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  getUnreadCount: (recipientType: string, userId?: number) => number;
  getUserNotifications: (userId: number) => Notification[];
  getAdminNotifications: () => Notification[];
  sendUserRegistrationNotification: (user_id: number, userName: string, userEmail: string) => Promise<void>;
  sendPaymentVerificationNotification: (user_id: number, amount: string, status: string) => Promise<void>;
  sendReminderNotification: (user_id: number, reminderTitle: string, dueDate: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
      notifications: [],
  fetchNotifications: async () => {
    const { data, error } = await supabase.from("notifications").select("*");
    if (!error && data) {
      set({ notifications: data });
    }
  },
  addNotification: async (notification) => {
    const { data, error } = await supabase.from("notifications").insert([notification]).select("id").single();
    if (error) {
      console.error("Supabase insert error:", error);
    }
    if (!error && data) {
      await get().fetchNotifications();
      return data.id;
    }
    return null;
  },
  updateNotification: async (id, notification) => {
    await supabase.from("notifications").update(notification).eq("id", id);
    await get().fetchNotifications();
  },
  markAsRead: async (notificationId) => {
    await get().updateNotification(notificationId, { status: "read" });
      },
  markAllAsRead: async (recipientType, userId) => {
    // This should be implemented as a batch update in production
    const notifications = get().notifications.filter(n => n.recipient_type === recipientType && (recipientType !== "user" || n.user_id === userId));
    for (const n of notifications) {
      await get().updateNotification(n.id, { status: "read" });
    }
    await get().fetchNotifications();
      },
  deleteNotification: async (notificationId) => {
    await supabase.from("notifications").delete().eq("id", notificationId);
    await get().fetchNotifications();
      },
      getUnreadCount: (recipientType, userId) => {
        return get().notifications.filter((notification) => {
      if (notification.status !== "unread") return false;
      if (notification.recipient_type !== recipientType) return false;
          if (recipientType === "user" && userId !== undefined) {
        return notification.user_id === userId;
          }
      return true;
    }).length;
      },
  getUserNotifications: (user_id) => {
        return get().notifications.filter(
      (notification) => notification.recipient_type === "user" && notification.user_id === user_id,
    );
      },
      getAdminNotifications: () => {
    return get().notifications.filter((notification) => notification.recipient_type === "admin");
      },
  sendUserRegistrationNotification: async (user_id, userName, userEmail) => {
    await get().addNotification({
      user_id,
      recipient_type: "admin",
          type: "system",
          title: "New User Registration",
          message: `${userName} (${userEmail}) has registered a new account.`,
          priority: "medium",
      read_at: "",
      status: "unread",
    });
      },
  sendPaymentVerificationNotification: async (user_id, amount, status) => {
    await get().addNotification({
      user_id,
      recipient_type: "user",
          type: "email",
          title: status === "verified" ? "Payment Verified" : "Payment Rejected",
          message:
            status === "verified"
          ? `Your payment of ${amount} TZS has been verified. Your subscription has been updated.`
          : `Your payment of ${amount} TZS could not be verified. Please check the details and try again.`,
          priority: status === "verified" ? "medium" : "high",
      read_at: "",
      status: "unread",
    });
        if (status === "verified") {
      await get().addNotification({
        user_id,
        recipient_type: "user",
            type: "sms",
            title: "Payment Verified",
        message: `Your Gari Langu payment of ${amount} TZS has been verified. Thank you!`,
            priority: "medium",
        read_at: "",
        status: "unread",
      });
        }
      },
  sendReminderNotification: async (user_id, reminderTitle, dueDate) => {
    const formattedDate = new Date(dueDate).toLocaleDateString();
    await get().addNotification({
      user_id,
      recipient_type: "user",
          type: "email",
          title: "Service Reminder",
          message: `Reminder: ${reminderTitle} is due on ${formattedDate}. Please schedule your service soon.`,
          priority: "medium",
      read_at: "",
      status: "unread",
    });
    await get().addNotification({
      user_id,
      recipient_type: "user",
          type: "sms",
          title: "Service Reminder",
          message: `Gari Langu Reminder: ${reminderTitle} is due on ${formattedDate}.`,
          priority: "medium",
      read_at: "",
      status: "unread",
    });
  },
}))
