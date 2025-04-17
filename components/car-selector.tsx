"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCarStore } from "@/lib/car-store"
import { Car, ChevronDown } from "lucide-react"

interface CarSelectorProps {
  onSelect: (carId: number) => void
}

export function CarSelector({ onSelect }: CarSelectorProps) {
  const { cars } = useCarStore()
  const [selectedCar, setSelectedCar] = useState<number | null>(null)

  const handleSelect = (carId: number) => {
    setSelectedCar(carId)
    onSelect(carId)
  }

  const getSelectedCarName = () => {
    if (!selectedCar) return "Select a car"
    const car = cars.find((c) => c.id === selectedCar)
    if (!car) return "Select a car"
    return `${car.make} ${car.model} (${car.licensePlate})`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between md:w-[260px]">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span>{getSelectedCarName()}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[260px]">
        {cars.map((car) => (
          <DropdownMenuItem key={car.id} onClick={() => handleSelect(car.id)}>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              <span>
                {car.make} {car.model} ({car.licensePlate})
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
