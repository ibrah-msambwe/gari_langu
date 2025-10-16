"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCarStore } from "@/lib/car-store"
import { useToast } from "@/components/ui/use-toast"
import { Eye, Pencil, Plus, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { CardSkeleton } from "@/components/ui/skeleton-loader"

export default function CarsPage() {
  const { cars, deleteCar, fetchCars } = useCarStore()
  const { toast } = useToast()
  const [carToDelete, setCarToDelete] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCars = async () => {
      setIsLoading(true)
      await fetchCars()
      setIsLoading(false)
    }
    loadCars()
  }, [fetchCars])

  const handleRefresh = async () => {
    await fetchCars()
    toast({
      title: "Refreshed",
      description: "Car list has been updated.",
    })
  }

  const handleDeleteCar = (id: number) => {
    deleteCar(id)
    toast({
      title: "Car deleted",
      description: "The vehicle has been removed from your account.",
    })
    setCarToDelete(null)
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-4 md:space-y-6 page-transition">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Cars</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your registered vehicles</p>
        </div>
        <Link href="/dashboard/cars/add" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-11">
            <Plus className="mr-2 h-4 w-4" />
            Add Car
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center card-appear">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-muted-foreground"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold">No cars registered</h3>
          <p className="mt-2 text-sm text-muted-foreground">You haven't added any vehicles to your account yet.</p>
          <Link href="/dashboard/cars/add" className="mt-4">
            <Button className="touch-feedback ripple min-h-[44px] min-w-[120px]">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Car
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car, index) => (
            <Card 
              key={car.id} 
              className="overflow-hidden elevation-2 hover:elevation-3 transition-all duration-300 card-appear"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative w-full h-48 md:h-52">
                <Image 
                  src={car.image || "/placeholder.svg"} 
                  alt={car.make + " " + car.model} 
                  fill
                  className="object-cover" 
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-3 md:p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-semibold">
                      {car.make} {car.model}
                    </h3>
                    <span className="text-xs md:text-sm text-muted-foreground">{car.year}</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">License: {car.license_plate}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Link href={`/dashboard/cars/${car.id}`} className="flex-1 min-w-[80px]">
                      <Button variant="outline" size="sm" className="w-full min-h-[44px] touch-feedback">
                        <Eye className="mr-1 h-4 w-4" />
                        <span className="text-xs">View</span>
                      </Button>
                    </Link>
                    <Link href={`/dashboard/cars/${car.id}/edit`} className="flex-1 min-w-[80px]">
                      <Button variant="outline" size="sm" className="w-full min-h-[44px] touch-feedback">
                        <Pencil className="mr-1 h-4 w-4" />
                        <span className="text-xs">Edit</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 min-w-[80px] min-h-[44px] text-red-500 hover:bg-red-50 hover:text-red-600 touch-feedback"
                      onClick={() => setCarToDelete(car.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      <span className="text-xs">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={carToDelete !== null} onOpenChange={(open) => !open && setCarToDelete(null)}>
        <AlertDialogContent className="backdrop-blur-modal">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this car?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle and all associated service records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 min-h-[44px]"
              onClick={() => carToDelete !== null && handleDeleteCar(carToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </PullToRefresh>
  )
}
