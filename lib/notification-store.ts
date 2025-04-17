import { create } from "zustand"
import { persist } from "zustand/middleware"

export type NotificationType = "email" | "sms" | "system"
export type NotificationPriority = "low" | "medium" | "high"
export type NotificationStatus = "unread" | "read"

export interface Notification {
  id: number
  userId: number | null // null for admin notifications
  recipientType: "user" | "admin"
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  status: NotificationStatus
  createdAt: string
  readAt?: string
}

// Helper function to generate a unique ID
const generateId = (items: { id: number }[]) => {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
}

export const useNotificationStore = create<{
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "status">) => Notification
  markAsRead: (notificationId: number) => void
  markAllAsRead: (recipientType: "user" | "admin", userId?: number) => void
  deleteNotification: (notificationId: number) => void
  getUnreadCount: (recipientType: "user" | "admin", userId?: number) => number
  getUserNotifications: (userId: number) => Notification[]
  getAdminNotifications: () => Notification[]
  sendUserRegistrationNotification: (userId: number, userName: string, userEmail: string) => void
  sendPaymentVerificationNotification: (userId: number, amount: number, status: "verified" | "rejected") => void
  sendReminderNotification: (userId: number, reminderTitle: string, dueDate: string) => void
}>()(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: generateId(get().notifications),
          createdAt: new Date().toISOString(),
          status: "unread",
        }

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }))

        return newNotification
      },
      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, status: "read", readAt: new Date().toISOString() }
              : notification,
          ),
        }))
      },
      markAllAsRead: (recipientType, userId) => {
        set((state) => ({
          notifications: state.notifications.map((notification) => {
            if (notification.recipientType === recipientType) {
              if (recipientType === "user" && userId !== undefined && notification.userId === userId) {
                return { ...notification, status: "read", readAt: new Date().toISOString() }
              } else if (recipientType === "admin") {
                return { ...notification, status: "read", readAt: new Date().toISOString() }
              }
            }
            return notification
          }),
        }))
      },
      deleteNotification: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== notificationId),
        }))
      },
      getUnreadCount: (recipientType, userId) => {
        return get().notifications.filter((notification) => {
          if (notification.status !== "unread") return false
          if (notification.recipientType !== recipientType) return false
          if (recipientType === "user" && userId !== undefined) {
            return notification.userId === userId
          }
          return true
        }).length
      },
      getUserNotifications: (userId) => {
        return get().notifications.filter(
          (notification) => notification.recipientType === "user" && notification.userId === userId,
        )
      },
      getAdminNotifications: () => {
        return get().notifications.filter((notification) => notification.recipientType === "admin")
      },
      sendUserRegistrationNotification: (userId, userName, userEmail) => {
        // Add notification for admin
        get().addNotification({
          userId: null,
          recipientType: "admin",
          type: "system",
          title: "New User Registration",
          message: `${userName} (${userEmail}) has registered a new account.`,
          priority: "medium",
        })
      },
      sendPaymentVerificationNotification: (userId, amount, status) => {
        // Add notification for user
        get().addNotification({
          userId,
          recipientType: "user",
          type: "email",
          title: status === "verified" ? "Payment Verified" : "Payment Rejected",
          message:
            status === "verified"
              ? `Your payment of ${amount.toLocaleString()} TZS has been verified. Your subscription has been updated.`
              : `Your payment of ${amount.toLocaleString()} TZS could not be verified. Please check the details and try again.`,
          priority: status === "verified" ? "medium" : "high",
        })

        // Also send SMS for important notifications
        if (status === "verified") {
          get().addNotification({
            userId,
            recipientType: "user",
            type: "sms",
            title: "Payment Verified",
            message: `Your Gari Langu payment of ${amount.toLocaleString()} TZS has been verified. Thank you!`,
            priority: "medium",
          })
        }
      },
      sendReminderNotification: (userId, reminderTitle, dueDate) => {
        const formattedDate = new Date(dueDate).toLocaleDateString()

        // Add email notification
        get().addNotification({
          userId,
          recipientType: "user",
          type: "email",
          title: "Service Reminder",
          message: `Reminder: ${reminderTitle} is due on ${formattedDate}. Please schedule your service soon.`,
          priority: "medium",
        })

        // Add SMS notification
        get().addNotification({
          userId,
          recipientType: "user",
          type: "sms",
          title: "Service Reminder",
          message: `Gari Langu Reminder: ${reminderTitle} is due on ${formattedDate}.`,
          priority: "medium",
        })
      },
    }),
    {
      name: "gari-langu-notifications",
    },
  ),
)
