"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Car, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useCarStore } from "@/lib/car-store"
import { useReminderStore } from "@/lib/reminder-store"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

// Service types
const serviceTypes = [
  "Oil Change",
  "Tire Rotation",
  "Brake Inspection",
  "Air Filter Replacement",
  "Full Service",
  "Wheel Alignment",
  "Battery Check",
  "Fluid Check",
  "Engine Tune-up",
  "Other",
]

export default function AddReminderPage() {
  const router = useRouter()
  const { cars } = useCarStore()
  const { addReminder } = useReminderStore()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [notificationTypes, setNotificationTypes] = useState({
    email: true,
    sms: false,
  })

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    if (!date) {
      toast({
        title: "Error",
        description: "Please select a due date for the reminder.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Create reminder object
    const reminder = {
      carId: Number(formData.get("carId")),
      serviceType: formData.get("serviceType") as string,
      dueDate: format(date, "yyyy-MM-dd"),
      status: getDueStatus(date),
      notificationSent: false,
      notificationTypes: getSelectedNotificationTypes(),
      notificationSchedule: getNotificationSchedule(formData.get("notificationSchedule") as string),
      priority: formData.get("priority") as "high" | "medium" | "low",
      notes: (formData.get("notes") as string) || undefined,
    }

    // Add reminder to store
    addReminder(reminder)

    // Show success toast
    toast({
      title: "Reminder added",
      description: "The service reminder has been added successfully.",
    })

    // Redirect to reminders page
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/reminders")
    }, 1000)
  }

  const getDueStatus = (dueDate: Date): "upcoming" | "future" => {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now)
    thirtyDaysFromNow.setDate(now.getDate() + 30)

    return dueDate <= thirtyDaysFromNow ? "upcoming" : "future"
  }

  const getSelectedNotificationTypes = () => {
    const types: ("email" | "sms")[] = []
    if (notificationTypes.email) types.push("email")
    if (notificationTypes.sms) types.push("sms")
    return types
  }

  const getNotificationSchedule = (value: string): string => {
    switch (value) {
      case "1day":
        return "1 day before"
      case "3days":
        return "3 days before"
      case "1week":
        return "1 week before"
      case "2weeks":
        return "2 weeks before"
      case "1month":
        return "1 month before"
      default:
        return "1 week before"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Service Reminder</h1>
        <p className="text-muted-foreground">Create a new maintenance reminder for your vehicle</p>
      </div>
      <Card>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Reminder Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="car">Select Vehicle</Label>
                <Select name="carId" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {cars.map((car) => (
                      <SelectItem key={car.id} value={car.id.toString()}>
                        <div className="flex items-center">
                          <Car className="mr-2 h-4 w-4" />
                          <span>
                            {car.make} {car.model} ({car.licensePlate})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select name="serviceType" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <input type="hidden" name="dueDate" value={date ? format(date, "yyyy-MM-dd") : ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" defaultValue="medium">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notification Schedule</Label>
                <Select name="notificationSchedule" defaultValue="1week">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select when to notify" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1day">1 day before</SelectItem>
                    <SelectItem value="3days">3 days before</SelectItem>
                    <SelectItem value="1week">1 week before</SelectItem>
                    <SelectItem value="2weeks">2 weeks before</SelectItem>
                    <SelectItem value="1month">1 month before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notification Methods</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email"
                      checked={notificationTypes.email}
                      onCheckedChange={(checked) =>
                        setNotificationTypes({ ...notificationTypes, email: checked === true })
                      }
                    />
                    <Label htmlFor="email" className="font-normal">
                      Email Notification
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms"
                      checked={notificationTypes.sms}
                      onCheckedChange={(checked) =>
                        setNotificationTypes({ ...notificationTypes, sms: checked === true })
                      }
                    />
                    <Label htmlFor="sms" className="font-normal">
                      SMS Notification
                    </Label>
                  </div>
                </div>
                <input type="hidden" name="notificationTypes" value={JSON.stringify(notificationTypes)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional details about this service reminder"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/reminders">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isLoading || !date}>
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Reminder"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
