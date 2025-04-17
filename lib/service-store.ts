import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ServiceRecord = {
  id: number
  carId: number
  date: string
  type: string
  description: string
  mileage: number
  cost: number
  provider?: string
  notes?: string
  fromReminder?: boolean
  reminderId?: number
}

type ServiceStore = {
  services: ServiceRecord[]
  addService: (service: Omit<ServiceRecord, "id">) => number
  updateService: (id: number, service: Partial<ServiceRecord>) => void
  deleteService: (id: number) => void
  getServicesByCarId: (carId: number) => ServiceRecord[]
  addServiceFromReminder: (
    carId: number,
    reminderId: number,
    serviceType: string,
    date: string,
    notes?: string,
  ) => number
}

export const useServiceStore = create<ServiceStore>()(
  persist(
    (set, get) => ({
      services: [], // No sample data - users will add their own service records
      addService: (service) => {
        const services = get().services
        const newId = services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1
        const newService = { ...service, id: newId }

        set({ services: [...services, newService] })
        return newId // Return the new ID for redirection or confirmation
      },
      updateService: (id, updatedService) => {
        const services = get().services
        set({
          services: services.map((service) => (service.id === id ? { ...service, ...updatedService } : service)),
        })
      },
      deleteService: (id) => {
        const services = get().services
        set({ services: services.filter((service) => service.id !== id) })
      },
      getServicesByCarId: (carId) => {
        return get().services.filter((service) => service.carId === carId)
      },
      addServiceFromReminder: (carId, reminderId, serviceType, date, notes) => {
        // Create a new service record from a completed reminder
        const newService = {
          carId,
          date,
          type: serviceType,
          description: `${serviceType} (from reminder)`,
          mileage: 0, // Default value, could be updated later
          cost: 0, // Default value, could be updated later
          notes: notes || "Service completed from reminder",
          fromReminder: true,
          reminderId,
        }

        return get().addService(newService)
      },
    }),
    {
      name: "service-storage",
    },
  ),
)
