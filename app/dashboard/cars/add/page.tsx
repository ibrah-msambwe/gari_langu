"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCarStore } from "@/lib/car-store"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useAuthStore } from "@/lib/auth-store"

export default function AddCarPage() {
  const router = useRouter()
  const { addCar } = useCarStore()
  const { toast } = useToast()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [formError, setFormError] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setFormError("")

    try {
      const formData = new FormData(event.currentTarget)

      // Validate required fields
      const make = formData.get("make") as string
      const model = formData.get("model") as string
      const year = formData.get("year") as string
      const license_plate = formData.get("licensePlate") as string
      if (!make || !model || !year || !license_plate) {
        setFormError("Please fill in all required fields")
        setIsLoading(false)
        return
      }

      // Use actual user_id from auth/session
      const user_id = user?.id
      if (!user_id) {
        setFormError("User not authenticated. Please log in again.")
        setIsLoading(false)
        return
      }

      // Create car object from form data (old object removed)
      const car = {
        make,
        model,
        year,
        license_plate,
        color: (formData.get("color") as string) || "",
        vin: (formData.get("vin") as string) || "",
        description: (formData.get("description") as string) || "",
        image: previewImage || "/placeholder.svg?height=200&width=300",
        user_id: String(user_id),
      }

      // Await the async addCar
      const newCarId = await addCar(car)

      if (newCarId) {
      toast({
        title: "Car added",
        description: "Your car has been added successfully.",
      })
      setTimeout(() => {
        setIsLoading(false)
        router.push(`/dashboard/cars/${newCarId}`)
      }, 1000)
      } else {
        setFormError("There was a problem adding your car. Please try again.")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error adding car:", error)
      setFormError("There was a problem adding your car. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Car</h1>
        <p className="text-muted-foreground">Register a new vehicle to your account</p>
      </div>
      <Card>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {formError && <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">{formError}</div>}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" name="make" placeholder="Toyota" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" placeholder="Corolla" required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" name="year" type="number" placeholder="2020" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input id="licensePlate" name="licensePlate" placeholder="KCX 123A" required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" name="color" placeholder="White" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN (Optional)</Label>
                  <Input id="vin" name="vin" placeholder="Vehicle Identification Number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" name="description" placeholder="Additional details about your vehicle" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Vehicle Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                {previewImage && (
                  <div className="mt-2">
                    <Image src={previewImage || "/placeholder.svg"} alt="Car preview" width={300} height={200} className="rounded-md object-cover" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/cars">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Car"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
