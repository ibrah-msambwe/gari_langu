"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { useCarStore } from "@/lib/car-store"
import { useServiceStore } from "@/lib/service-store"
import { useReminderStore } from "@/lib/reminder-store"

export function DataLoader() {
  const { isAuthenticated, user } = useAuthStore()
  const { fetchCars } = useCarStore()
  const { fetchServices } = useServiceStore()
  const { fetchReminders } = useReminderStore()

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("[DataLoader] User authenticated, fetching data...")
      
      // Fetch all data in parallel
      Promise.all([
        fetchCars(),
        fetchServices(),
        fetchReminders()
      ]).then(() => {
        console.log("[DataLoader] All data fetched successfully")
      }).catch((error) => {
        console.error("[DataLoader] Error fetching data:", error)
      })
    }
  }, [isAuthenticated, user, fetchCars, fetchServices, fetchReminders])

  return null
}

