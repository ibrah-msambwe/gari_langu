import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabaseClient"

export type ServiceRecord = {
  id: number // bigint in Supabase, number in JS
  created_at: string // timestamp with time zone as ISO string
  user_id: string // uuid
  date: string // date
  from_reminder: boolean
  reminder_id: string // uuid
  car_id: number // bigint in Supabase, number in JS
  cost: string
  notes: string
  type: string
  description: string
  mileage: string
}

type ServiceStore = {
  services: ServiceRecord[]
  fetchServices: () => Promise<void>
  addService: (service: Omit<ServiceRecord, "id" | "created_at">) => Promise<number | null>
  updateService: (id: number, service: Partial<ServiceRecord>) => Promise<void>
  deleteService: (id: number) => Promise<void>
  getServicesByCarId: (carId: number) => ServiceRecord[]
}

export const useServiceStore = create<ServiceStore>()((set, get) => ({
  services: [],
  fetchServices: async () => {
    // Get current user ID from auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error("No authenticated user found")
      set({ services: [] })
      return
    }
    
    // Fetch only services belonging to the current user
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
    
    if (error) {
      console.error("Error fetching services:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      
      // Check if table exists
      if (error.message?.includes("relation") || error.message?.includes("does not exist")) {
        console.error("Services table may not exist. Please run database migrations from DATABASE_SCHEMA.md")
      }
      
      set({ services: [] })
    } else if (data) {
      console.log(`Fetched ${data.length} services for user ${user.id}`)
      set({ services: data })
    } else {
      // No error but no data - table is empty
      console.log("No services found for user")
      set({ services: [] })
    }
  },
  addService: async (service) => {
    const { data, error } = await supabase.from("services").insert([service]).select("id").single()
    if (error) {
      console.error("Supabase insert error:", error)
    }
    if (!error && data) {
      await get().fetchServices()
      return data.id
    }
    return null
  },
  updateService: async (id, updatedService) => {
    await supabase.from("services").update(updatedService).eq("id", id)
    await get().fetchServices()
  },
  deleteService: async (id) => {
    await supabase.from("services").delete().eq("id", id)
    await get().fetchServices()
  },
  getServicesByCarId: (carId) => {
    return get().services.filter((service) => service.car_id === carId)
  },
}))
