import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Car = {
  id: number
  make: string
  model: string
  year: number
  licensePlate: string
  color?: string
  vin?: string
  description?: string
  image?: string
  lastService?: string
  nextService?: string
}

type CarStore = {
  cars: Car[]
  addCar: (car: Omit<Car, "id">) => number
  updateCar: (id: number, car: Partial<Car>) => void
  deleteCar: (id: number) => void
  getCar: (id: number) => Car | undefined
}

export const useCarStore = create<CarStore>()(
  persist(
    (set, get) => ({
      cars: [], // No sample data - users will add their own cars
      addCar: (car) => {
        const cars = get().cars
        const newId = cars.length > 0 ? Math.max(...cars.map((c) => c.id)) + 1 : 1
        const newCar = { ...car, id: newId }

        set({ cars: [...cars, newCar] })
        return newId // Return the new ID so we can redirect to the car detail page
      },
      updateCar: (id, updatedCar) => {
        const cars = get().cars
        set({
          cars: cars.map((car) => (car.id === id ? { ...car, ...updatedCar } : car)),
        })
      },
      deleteCar: (id) => {
        const cars = get().cars
        set({ cars: cars.filter((car) => car.id !== id) })
      },
      getCar: (id) => {
        return get().cars.find((car) => car.id === id)
      },
    }),
    {
      name: "car-storage",
    },
  ),
)
