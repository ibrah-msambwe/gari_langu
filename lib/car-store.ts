import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabaseClient"

export type Car = {
  id: number // bigint in Supabase, number in JS
  created_at: string // timestamp with time zone as ISO string
  user_id: string // UUID in Supabase, string in JS
  model: string
  year: string
  license_plate: string
  color: string
  vin: string
  image: string
  description: string
  make: string
}

type CarStore = {
  cars: Car[]
  fetchCars: () => Promise<void>
  addCar: (car: Omit<Car, "id" | "created_at">) => Promise<number | null>
  updateCar: (id: number, car: Partial<Car>) => Promise<void>
  deleteCar: (id: number) => Promise<void>
  getCar: (id: number) => Car | undefined
}

export const useCarStore = create<CarStore>()((set, get) => ({
  cars: [],
  fetchCars: async () => {
    // Get current user ID from auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error("No authenticated user found")
      set({ cars: [] })
      return
    }
    
    // Fetch only cars belonging to the current user
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching cars:", error)
      set({ cars: [] })
    } else if (data) {
      console.log(`Fetched ${data.length} cars for user ${user.id}`)
      set({ cars: data })
    }
  },
  addCar: async (car) => {
    console.log("Car to insert:", car);
    const { data, error } = await supabase.from("cars").insert([car]).select("id").single()
    console.log("Supabase insert data:", data)
    if (error) {
      console.error("Supabase insert error:", error.message, error)
    }
    if (!error && data) {
      await get().fetchCars()
      return data.id
    }
    return null
  },
  updateCar: async (id, updatedCar) => {
    await supabase.from("cars").update(updatedCar).eq("id", id)
    await get().fetchCars()
  },
  deleteCar: async (id) => {
    await supabase.from("cars").delete().eq("id", id)
    await get().fetchCars()
  },
  getCar: (id) => {
    return get().cars.find((car) => car.id === id)
  },
}))
