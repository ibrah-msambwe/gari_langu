"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type Car, useCarStore } from "@/lib/car-store"
import { useToast } from "@/components/ui/use-toast"

export default function EditCarPage() {
  const params = useParams()
  const router = useRouter()
  const { getCar, updateCar } = useCarStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [car, setCar] = useState<Car | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      const carId = Number.parseInt(params.id as string)
      const foundCar = getCar(carId)
      if (foundCar) {
        setCar(foundCar)
        setPreviewImage(foundCar.image || null)
      } else {
        // Car not found, redirect to cars list
        router.push("/dashboard/cars")
      }
    }
  }, [params.id, getCar, router])

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
    if (!car) return

    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    // Create updated car object from form data
    const updatedCar = {
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: Number.parseInt(formData.get("year") as string),
      licensePlate: formData.get("licensePlate") as string,
      color: (formData.get("color") as string) || undefined,
      vin: (formData.get("vin") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      image: previewImage || car.image,
    }

    // Update car in store
    updateCar(car.id, updatedCar)

    // Show success toast
    toast({
      title: "Car updated successfully",
      description: `Your ${updatedCar.make} ${updatedCar.model} has been updated.`,
    })

    // Redirect to car details page
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/dashboard/cars/${car.id}`)
    }, 1000)
  }

  if (!car) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading car details...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Car</h1>
        <p className="text-muted-foreground">Update your vehicle information</p>
      </div>
      <Card>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" name="make" defaultValue={car.make} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" defaultValue={car.model} required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" name="year" type="number" defaultValue={car.year} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input id="licensePlate" name="licensePlate" defaultValue={car.licensePlate} required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" name="color" defaultValue={car.color || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN (Optional)</Label>
                  <Input id="vin" name="vin" defaultValue={car.vin || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" name="description" defaultValue={car.description || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Vehicle Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                {(previewImage || car.image) && (
                  <div className="mt-2">
                    <img
                      src={previewImage || car.image || "/placeholder.svg"}
                      alt="Vehicle preview"
                      className="h-48 w-full rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/dashboard/cars/${car.id}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
