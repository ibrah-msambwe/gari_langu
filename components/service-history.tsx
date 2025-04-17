"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useServiceStore } from "@/lib/service-store"
import { useLanguage } from "@/components/language-provider"
import { Wrench, Trash2, Plus, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddServiceForm } from "@/components/add-service-form"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ServiceHistoryProps {
  carId: number
}

export function ServiceHistory({ carId }: ServiceHistoryProps) {
  const { getServicesByCarId, deleteService } = useServiceStore()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null)
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filter, setFilter] = useState<"all" | "manual" | "reminder">("all")

  // Force refresh when needed
  const refreshServices = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Get services for this car and sort by date (newest first)
  const allServices = getServicesByCarId(carId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Apply filter
  const services =
    filter === "all"
      ? allServices
      : filter === "manual"
        ? allServices.filter((s) => !s.fromReminder)
        : allServices.filter((s) => s.fromReminder)

  const handleDeleteService = (id: number) => {
    deleteService(id)
    toast({
      title: "Service record deleted",
      description: "The service record has been removed successfully.",
    })
    setServiceToDelete(null)
  }

  const handleAddServiceSuccess = () => {
    setIsAddServiceDialogOpen(false)
    refreshServices()
    toast({
      title: "Service record added",
      description: "The service record has been added successfully.",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("services.title")}</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(value: "all" | "manual" | "reminder") => setFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="manual">Manual Entries</SelectItem>
                <SelectItem value="reminder">From Reminders</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => setIsAddServiceDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("services.add")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Wrench className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{t("services.empty.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("services.empty.subtitle")}</p>
              <Button className="mt-4" onClick={() => setIsAddServiceDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("services.empty.action")}
              </Button>
            </div>
          ) : (
            <Table key={refreshKey}>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("services.date")}</TableHead>
                  <TableHead>{t("services.type")}</TableHead>
                  <TableHead>{t("services.mileage")}</TableHead>
                  <TableHead>{t("services.cost")}</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">{t("common.delete")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{new Date(service.date).toLocaleDateString()}</TableCell>
                    <TableCell>{service.type}</TableCell>
                    <TableCell>{service.mileage.toLocaleString()} km</TableCell>
                    <TableCell>{formatCurrency(service.cost)}</TableCell>
                    <TableCell>
                      {service.fromReminder ? (
                        <Badge variant="outline" className="bg-blue-50">
                          Reminder
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50">
                          Manual
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setServiceToDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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

      <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("services.add")}</DialogTitle>
          </DialogHeader>
          <AddServiceForm
            carId={carId}
            onSuccess={handleAddServiceSuccess}
            onCancel={() => setIsAddServiceDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
