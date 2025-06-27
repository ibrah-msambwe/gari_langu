"use client"

import { useState } from "react"
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

export default function CarsPage() {
  const { cars, deleteCar } = useCarStore()
  const { toast } = useToast()
  const [carToDelete, setCarToDelete] = useState<number | null>(null)

  const handleDeleteCar = (id: number) => {
    deleteCar(id)
    toast({
      title: "Car deleted",
      description: "The vehicle has been removed from your account.",
    })
    setCarToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Cars</h1>
          <p className="text-muted-foreground">Manage your registered vehicles</p>
        </div>
        <Link href="/dashboard/cars/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Car
          </Button>
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Car
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <Image src={car.image || "/placeholder.svg?height=200&width=300"} alt={car.make + " " + car.model} width={300} height={200} className="rounded-md object-cover" />
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {car.make} {car.model}
                    </h3>
                    <span className="text-sm text-muted-foreground">{car.year}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">License: {car.licensePlate}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>
                      Last service: {car.lastService ? new Date(car.lastService).toLocaleDateString() : "N/A"}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      Next service: {car.nextService ? new Date(car.nextService).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/dashboard/cars/${car.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/cars/${car.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => setCarToDelete(car.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={carToDelete !== null} onOpenChange={(open) => !open && setCarToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this car?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle and all associated service records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => carToDelete !== null && handleDeleteCar(carToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
