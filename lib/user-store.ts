import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "./auth-store"

export type UserPreferences = {
  language: "en" | "sw"
  darkMode: boolean
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

type UserStore = {
  preferences: UserPreferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void
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
      preferences: defaultPreferences,
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        }))

        // Update language in auth store if changed
        if (newPreferences.language) {
          const authStore = useAuthStore.getState()
          if (authStore.currentUser) {
            authStore.updateCurrentUser({ language: newPreferences.language })
          }
        }
      },
    }),
    {
      name: "user-preferences",
    },
  ),
)
