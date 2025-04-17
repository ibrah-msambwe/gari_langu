"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Car, useCarStore } from "@/lib/car-store"
import { ArrowLeft, Calendar, CarIcon, Clock, Edit, Trash2, Wrench, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddServiceForm } from "@/components/add-service-form"
import { ServiceHistory } from "@/components/service-history"
import { useLanguage } from "@/components/language-provider"

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getCar, deleteCar } = useCarStore()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [car, setCar] = useState<Car | undefined>(undefined)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (params.id) {
      const carId = Number.parseInt(params.id as string)
      const foundCar = getCar(carId)
      if (foundCar) {
        setCar(foundCar)
      } else {
        // Car not found, redirect to cars list
        router.push("/dashboard/cars")
      }
    }
  }, [params.id, getCar, router, refreshKey])

  const handleDeleteCar = () => {
    if (car) {
      deleteCar(car.id)
      toast({
        title: "Car deleted",
        description: "The vehicle has been removed from your account.",
      })
      router.push("/dashboard/cars")
    }
  }

  const handleServiceSuccess = () => {
    setIsServiceDialogOpen(false)
    // Refresh car data to get updated service dates
    setRefreshKey((prev) => prev + 1)
    toast({
      title: "Service record added",
      description: "The service record has been added successfully.",
    })
  }

  if (!car) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">{t("common.loading")}</h2>
          <p className="text-muted-foreground">{t("common.please_wait")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/cars")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {car.make} {car.model}
            </h1>
            <p className="text-muted-foreground">{car.licensePlate}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/cars/${car.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              {t("cars.edit")}
            </Button>
          </Link>
          <Button variant="outline" className="text-red-500" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("cars.delete")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">{t("cars.title")}</TabsTrigger>
          <TabsTrigger value="services">{t("services.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("cars.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video overflow-hidden rounded-md">
                <img
                  src={car.image || "/placeholder.svg"}
                  alt={`${car.make} ${car.model}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("cars.make")}</p>
                  <p>{car.make}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("cars.model")}</p>
                  <p>{car.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("cars.year")}</p>
                  <p>{car.year}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("cars.license")}</p>
                  <p>{car.licensePlate}</p>
                </div>
                {car.color && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("cars.color")}</p>
                    <p>{car.color}</p>
                  </div>
                )}
                {car.vin && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("cars.vin")}</p>
                    <p>{car.vin}</p>
                  </div>
                )}
              </div>
              {car.description && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">{t("cars.description")}</p>
                  <p className="mt-1">{car.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("services.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{t("services.last")}</h3>
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {car.lastService ? new Date(car.lastService).toLocaleDateString() : t("services.no_record")}
                </p>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{t("services.next")}</h3>
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {car.nextService ? new Date(car.nextService).toLocaleDateString() : t("services.not_scheduled")}
                </p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => setIsServiceDialogOpen(true)}>
                  <Wrench className="mr-2 h-4 w-4" />
                  {t("services.add")}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setActiveTab("services")}>
                  <CarIcon className="mr-2 h-4 w-4" />
                  {t("services.history")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">{t("services.title")}</h2>
            <Button onClick={() => setIsServiceDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("services.add")}
            </Button>
          </div>

          <ServiceHistory carId={car.id} key={refreshKey} />
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("cars.delete.confirm")}</AlertDialogTitle>
            <AlertDialogDescription>{t("cars.delete.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteCar}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("services.add")}</DialogTitle>
          </DialogHeader>
          <AddServiceForm
            carId={car.id}
            onSuccess={handleServiceSuccess}
            onCancel={() => setIsServiceDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
