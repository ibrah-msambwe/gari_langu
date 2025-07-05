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
    const { data, error } = await supabase.from("cars").select("*")
    if (!error && data) {
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
