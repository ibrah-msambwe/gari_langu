import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabaseClient"

export type ServiceRecord = {
  id: number // bigint in Supabase, number in JS
  created_at: string // timestamp with time zone as ISO string
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
    const { data, error } = await supabase.from("services").select("*")
    if (!error && data) {
      set({ services: data })
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
