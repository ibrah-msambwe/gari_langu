import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useNotificationStore } from "./notification-store"

export type PaymentStatus = "pending" | "verified" | "rejected"

export interface PaymentRecord {
  id: number
  userId: number
  amount: number
  date: string
  method: string
  months: number
  status: PaymentStatus
  transactionId?: string
  verificationMessage?: string
  verificationImage?: string
  adminNotes?: string
}

export interface User {
  id: number
  name: string
  email: string
  password: string
  phone?: string
  registrationDate: string
  trialEndDate: string
  isSubscribed: boolean
  subscriptionEndDate?: string
  pendingPayment?: boolean
  language: "en" | "sw"
  isAdmin?: boolean
  isActive?: boolean // Whether the user can access the system (controlled by admin)
  avatar?: string
}

// Helper function to create a trial end date (7 days from now)
const createTrialEndDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString()
}

// Helper function to generate a unique ID
const generateId = (items: { id: number }[]) => {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
}

export const useAuthStore = create<{
  currentUser: User | null
  users: User[]
  payments: PaymentRecord[]
  isAuthenticated: boolean
  isAdminMode: boolean
  login: (email: string, password: string) => boolean
  loginAdmin: (email: string, password: string) => boolean
  logout: () => void
  registerUser: (
    userData: Omit<User, "id" | "registrationDate" | "trialEndDate" | "isSubscribed" | "isActive">,
  ) => number
  updateUser: (userId: number, userData: Partial<User>) => void
  deleteUser: (userId: number) => void
  updateCurrentUser: (userData: Partial<User>) => void
  addPayment: (paymentData: Omit<PaymentRecord, "id" | "date" | "status">) => PaymentRecord
  updatePaymentStatus: (paymentId: number, status: PaymentStatus, adminNotes?: string) => void
  getPaymentsByUserId: (userId: number) => PaymentRecord[]
  isAdmin: () => boolean
  canAccessApp: () => boolean
  isTrialExpired: () => boolean
  setUserActive: (userId: number, isActive: boolean) => void
}>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          password: "password",
          phone: "+255 123 456 789",
          registrationDate: new Date().toISOString(),
          trialEndDate: createTrialEndDate(),
          isSubscribed: false,
          language: "en",
          isActive: true,
        },
        {
          id: 2,
          name: "Ibrahim Msambwe",
          email: "msambwe2@gmail.com",
          password: "Msambwe@4687",
          phone: "+255 712 815 726",
          registrationDate: new Date().toISOString(),
          trialEndDate: createTrialEndDate(),
          isSubscribed: true,
          subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          language: "en",
          isAdmin: true,
          isActive: true,
        },
      ],
      payments: [],
      isAuthenticated: false,
      isAdminMode: false,
      login: (email, password) => {
        const user = get().users.find((u) => u.email === email && u.password === password)
        if (user) {
          // Check if user is active (allowed by admin)
          if (user.isActive === false) {
            return false
          }

          set({ currentUser: user, isAuthenticated: true, isAdminMode: !!user.isAdmin })
          return true
        }
        return false
      },
      loginAdmin: (email, password) => {
        const admin = get().users.find((u) => u.email === email && u.password === password && u.isAdmin)
        if (admin) {
          set({ currentUser: admin, isAuthenticated: true, isAdminMode: true })
          return true
        }
        return false
      },
      logout: () => {
        set({ currentUser: null, isAuthenticated: false, isAdminMode: false })
      },
      registerUser: (userData) => {
        const users = get().users
        const newId = generateId(users)

        // Set registration date to today
        const registrationDate = new Date().toISOString()

        // Set trial end date to 7 days from now
        const trialEndDate = new Date()
        trialEndDate.setDate(trialEndDate.getDate() + 7)

        const newUser: User = {
          ...userData,
          id: newId,
          registrationDate,
          trialEndDate: trialEndDate.toISOString(),
          isSubscribed: false,
          isActive: true, // By default, users are active
        }

        set({
          users: [...users, newUser],
        })

        return newId
      },
      updateUser: (userId, userData) => {
        const users = get().users
        const updatedUsers = users.map((user) => (user.id === userId ? { ...user, ...userData } : user))

        set({ users: updatedUsers })

        // If the updated user is the current user, update currentUser as well
        const currentUser = get().currentUser
        if (currentUser && currentUser.id === userId) {
          set({ currentUser: { ...currentUser, ...userData } })
        }
      },
      deleteUser: (userId) => {
        const users = get().users
        const updatedUsers = users.filter((user) => user.id !== userId)
        set({ users: updatedUsers })
      },
      updateCurrentUser: (userData) => {
        const currentUser = get().currentUser
        if (!currentUser) return

        const updatedUser = { ...currentUser, ...userData }
        set({ currentUser: updatedUser })

        // Also update in the users array
        get().updateUser(currentUser.id, userData)
      },
      addPayment: (paymentData) => {
        // Create a new payment with safe serializable data
        const newPayment: PaymentRecord = {
          id: generateId(get().payments),
          date: new Date().toISOString(),
          status: "pending",
          ...paymentData,
        }

        // Update the state in a safe way
        set((state) => {
          // Create a new payments array with the new payment
          const updatedPayments = [...state.payments, newPayment]

          // Update the user's pendingPayment status
          const updatedUsers = state.users.map((user) =>
            user.id === paymentData.userId ? { ...user, pendingPayment: true } : user,
          )

          // Return the updated state
          return {
            payments: updatedPayments,
            users: updatedUsers,
          }
        })

        return newPayment
      },
      updatePaymentStatus: (paymentId, status, adminNotes) => {
        const payment = get().payments.find((p) => p.id === paymentId)
        if (!payment) return

        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === paymentId ? { ...p, status, adminNotes: adminNotes || p.adminNotes } : p,
          ),
        }))

        // If payment is verified, update the user's subscription
        if (status === "verified") {
          const payment = get().payments.find((p) => p.id === paymentId)
          if (!payment) return

          const user = get().users.find((u) => u.id === payment.userId)
          if (!user) return

          let subscriptionEndDate: Date

          if (user.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date()) {
            // If subscription is active, extend from current end date
            subscriptionEndDate = new Date(user.subscriptionEndDate)
          } else {
            // If subscription is expired or doesn't exist, start from today
            subscriptionEndDate = new Date()
          }

          // Add months to subscription
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + payment.months)

          // Update user subscription and activate the user
          get().updateUser(payment.userId, {
            subscriptionEndDate: subscriptionEndDate.toISOString(),
            isSubscribed: true,
            pendingPayment: false,
            isActive: true, // Activate user when payment is verified
          })

          // Send notification to user
          useNotificationStore
            .getState()
            .sendPaymentVerificationNotification(payment.userId, payment.amount, "verified")
        } else if (status === "rejected") {
          // If payment is rejected, remove the pending payment flag
          const payment = get().payments.find((p) => p.id === paymentId)
          if (!payment) return

          get().updateUser(payment.userId, {
            pendingPayment: false,
          })

          // Send notification to user
          useNotificationStore
            .getState()
            .sendPaymentVerificationNotification(payment.userId, payment.amount, "rejected")
        }
      },
      getPaymentsByUserId: (userId) => {
        return get().payments.filter((p) => p.userId === userId)
      },
      isAdmin: () => {
        const currentUser = get().currentUser
        return !!currentUser?.isAdmin && get().isAdminMode
      },
      canAccessApp: () => {
        const currentUser = get().currentUser
        if (!currentUser) return false

        // Check if user is active (allowed by admin)
        if (currentUser.isActive === false) return false

        // Admin can always access the app
        if (currentUser.isAdmin) return true

        // Check if user is subscribed and subscription is valid
        if (currentUser.isSubscribed && currentUser.subscriptionEndDate) {
          const subscriptionEndDate = new Date(currentUser.subscriptionEndDate)
          if (new Date() <= subscriptionEndDate) {
            return true
          }
        }

        // If not subscribed, check if trial is still valid
        const trialEndDate = new Date(currentUser.trialEndDate)
        return new Date() <= trialEndDate
      },
      isTrialExpired: () => {
        const currentUser = get().currentUser
        if (!currentUser) return true

        const trialEndDate = new Date(currentUser.trialEndDate)
        return new Date() > trialEndDate
      },
      setUserActive: (userId, isActive) => {
        get().updateUser(userId, { isActive })
      },
    }),
    {
      name: "gari-langu-storage",
    },
  ),
)
