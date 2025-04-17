import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useServiceStore } from "./service-store"

export type ReminderPriority = "high" | "medium" | "low"
export type ReminderStatus = "upcoming" | "future" | "completed"
export type NotificationType = "email" | "sms"

export type Reminder = {
  id: number
  carId: number
  serviceType: string
  dueDate: string
  status: ReminderStatus
  notificationSent: boolean
  notificationTypes: NotificationType[]
  notificationSchedule: string
  priority: ReminderPriority
  notes?: string
  completedDate?: string
  addedToServiceHistory?: boolean
}

type ReminderStore = {
  reminders: Reminder[]
  addReminder: (reminder: Omit<Reminder, "id">) => void
  updateReminder: (id: number, reminder: Partial<Reminder>) => void
  deleteReminder: (id: number) => void
  markAsComplete: (id: number) => void
  markNotificationSent: (id: number) => void
  getRemindersByCarId: (carId: number) => Reminder[]
  getRemindersByStatus: (status: ReminderStatus) => Reminder[]
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: [], // No sample data - users will add their own reminders
      addReminder: (reminder) => {
        const reminders = get().reminders
        const newId = reminders.length > 0 ? Math.max(...reminders.map((r) => r.id)) + 1 : 1
        set({ reminders: [...reminders, { ...reminder, id: newId }] })
      },
      updateReminder: (id, updatedReminder) => {
        const reminders = get().reminders
        set({
          reminders: reminders.map((reminder) => (reminder.id === id ? { ...reminder, ...updatedReminder } : reminder)),
        })
      },
      deleteReminder: (id) => {
        const reminders = get().reminders
        set({ reminders: reminders.filter((reminder) => reminder.id !== id) })
      },
      markAsComplete: (id) => {
        const reminders = get().reminders
        const reminder = reminders.find((r) => r.id === id)

        if (!reminder) return

        const completedDate = new Date().toISOString().split("T")[0]

        // Add to service history automatically
        if (!reminder.addedToServiceHistory) {
          const serviceStore = useServiceStore.getState()
          serviceStore.addServiceFromReminder(
            reminder.carId,
            reminder.id,
            reminder.serviceType,
            completedDate,
            reminder.notes,
          )
        }

        set({
          reminders: reminders.map((reminder) =>
            reminder.id === id
              ? {
                  ...reminder,
                  status: "completed",
                  completedDate,
                  addedToServiceHistory: true,
                }
              : reminder,
          ),
        })
      },
      markNotificationSent: (id) => {
        const reminders = get().reminders
        set({
          reminders: reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, notificationSent: true } : reminder,
          ),
        })
      },
      getRemindersByCarId: (carId) => {
        return get().reminders.filter((reminder) => reminder.carId === carId)
      },
      getRemindersByStatus: (status) => {
        return get().reminders.filter((reminder) => reminder.status === status)
      },
    }),
    {
      name: "reminder-storage",
    },
  ),
)
