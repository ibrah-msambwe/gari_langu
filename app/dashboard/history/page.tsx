"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useServiceStore } from "@/lib/service-store"
import { useCarStore } from "@/lib/car-store"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddServiceForm } from "@/components/add-service-form"
import { Pencil, Plus, Trash2, Wrench } from "lucide-react"
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
import { useLanguage } from "@/components/language-provider"
import { CarSelector } from "@/components/car-selector"

export default function HistoryPage() {
  const { services, deleteService } = useServiceStore()
  const { getCar } = useCarStore()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false)
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null)
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Sort services by date (newest first)
  const sortedServices = [...services].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleAddService = (carId: number) => {
    setSelectedCarId(carId)
    setIsAddServiceDialogOpen(true)
  }

  const handleServiceSuccess = () => {
    setIsAddServiceDialogOpen(false)
    setRefreshKey((prev) => prev + 1)
    toast({
      title: "Service record added",
      description: "The service record has been added successfully.",
    })
  }

  const handleDeleteService = (id: number) => {
    deleteService(id)
    toast({
      title: "Service record deleted",
      description: "The service record has been removed successfully.",
    })
    setServiceToDelete(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getCarDetails = (carId: number) => {
    const car = getCar(carId)
    if (!car) return { make: "Unknown", model: "Unknown", licensePlate: "Unknown" }
    return {
      make: car.make,
      model: car.model,
      licensePlate: car.licensePlate,
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service History</h1>
          <p className="text-muted-foreground">Track maintenance records for your vehicles</p>
        </div>
        <div className="flex items-center gap-4">
          <CarSelector onSelect={setSelectedCarId} />
          <Button
            onClick={() =>
              selectedCarId
                ? handleAddService(selectedCarId)
                : toast({
                    title: "Select a car",
                    description: "Please select a car before adding a service record",
                    variant: "destructive",
                  })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Service Record
          </Button>
        </div>
      </div>
      <Card key={refreshKey}>
        <CardHeader>
          <CardTitle>Service Records</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Wrench className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No service records</h3>
              <p className="mt-2 text-sm text-muted-foreground">You haven't added any service records yet.</p>
              <Button
                className="mt-4"
                onClick={() =>
                  selectedCarId
                    ? handleAddService(selectedCarId)
                    : toast({
                        title: "Select a car",
                        description: "Please select a car before adding a service record",
                        variant: "destructive",
                      })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Service Record
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedServices.map((record) => {
                const car = getCarDetails(record.carId)
                return (
                  <div key={record.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{record.type}</h3>
                          <Badge variant="outline" className="text-xs">
                            {car.make} {car.model}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">License: {car.licensePlate}</p>
                        <p className="text-sm">Date: {new Date(record.date).toLocaleDateString()}</p>
                        <p className="text-sm">Mileage: {record.mileage.toLocaleString()} km</p>
                        <p className="text-sm">Cost: {formatCurrency(record.cost)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setServiceToDelete(record.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    {record.notes && (
                      <div className="mt-4 rounded-md bg-muted p-3">
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Service Record</DialogTitle>
          </DialogHeader>
          {selectedCarId && (
            <AddServiceForm
              carId={selectedCarId}
              onSuccess={handleServiceSuccess}
              onCancel={() => setIsAddServiceDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={serviceToDelete !== null} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this service record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => serviceToDelete !== null && handleDeleteService(serviceToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
