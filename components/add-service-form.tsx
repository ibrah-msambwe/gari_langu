"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useServiceStore } from "@/lib/service-store"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { useCarStore } from "@/lib/car-store"
import { Loader2 } from "lucide-react"

interface AddServiceFormProps {
  carId: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddServiceForm({ carId, onSuccess, onCancel }: AddServiceFormProps) {
  const { addService } = useServiceStore()
  const { getCar, updateCar } = useCarStore()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setFormError("")

    try {
      const formData = new FormData(event.currentTarget)
      const date = formData.get("date") as string
      const mileageValue = formData.get("mileage") as string
      const costValue = formData.get("cost") as string

      // Validate inputs
      if (!date) {
        setFormError("Service date is required")
        setIsLoading(false)
        return
      }

      if (!mileageValue || isNaN(Number(mileageValue))) {
        setFormError("Valid mileage is required")
        setIsLoading(false)
        return
      }

      if (!costValue || isNaN(Number(costValue))) {
        setFormError("Valid cost is required")
        setIsLoading(false)
        return
      }

      // Create service record with correct database field names (snake_case)
      const service = {
        car_id: carId,
        date,
        type: formData.get("type") as string,
        description: formData.get("description") as string,
        mileage: mileageValue.toString(),
        cost: costValue.toString(),
        notes: formData.get("notes") as string || "",
      }

      // Add service to store (await the async function)
      const newServiceId = await addService(service)
      
      if (!newServiceId) {
        setFormError("Failed to save service record. Please try again.")
        setIsLoading(false)
        return
      }

      // Update car's last service date
      const car = getCar(carId)
      if (car) {
        // Calculate next service date (3 months from service date)
        const serviceDate = new Date(date)
        const nextServiceDate = new Date(serviceDate)
        nextServiceDate.setMonth(nextServiceDate.getMonth() + 3)

        updateCar(carId, {
          lastService: date,
          nextService: nextServiceDate.toISOString().split("T")[0],
        })
      }

      // Show success toast
      toast({
        title: "Service added",
        description: "Your service record has been added successfully.",
      })

      // Call onSuccess callback
      setTimeout(() => {
        setIsLoading(false)
        if (onSuccess) onSuccess()
      }, 1000)
    } catch (error) {
      console.error("Error adding service record:", error)
      setFormError("An error occurred while adding the service record. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{t("services.add")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formError && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 mb-4">{formError}</div>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">{t("services.date")}</Label>
              <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">{t("services.type")}</Label>
              <Input id="type" name="type" placeholder="Oil Change" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("services.description")}</Label>
            <Input id="description" name="description" placeholder="Regular maintenance" required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mileage">{t("services.mileage")}</Label>
              <Input id="mileage" name="mileage" type="number" placeholder="5000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">{t("services.cost")}</Label>
              <Input id="cost" name="cost" type="number" placeholder="3500" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">{t("services.provider")}</Label>
            <Input id="provider" name="provider" placeholder="Service Center" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{t("services.notes")}</Label>
            <Textarea id="notes" name="notes" placeholder="Additional notes" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("settings.saving")}
              </>
            ) : (
              t("services.save")
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
