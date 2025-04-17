"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCarStore } from "@/lib/car-store"
import { useServiceStore } from "@/lib/service-store"
import { useReminderStore } from "@/lib/reminder-store"
import { useAuthStore } from "@/lib/auth-store"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Car, Plus, Wrench, Bell, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { cars } = useCarStore()
  const { services } = useServiceStore()
  const { reminders } = useReminderStore()
  const { currentUser } = useAuthStore()
  const { t } = useLanguage()

  // Get upcoming reminders (due in the next 30 days)
  const upcomingReminders = reminders
    .filter((reminder) => {
      const dueDate = new Date(reminder.dueDate)
      const today = new Date()
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(today.getDate() + 30)
      return dueDate <= thirtyDaysFromNow && reminder.status !== "completed"
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  // Get recent services (last 5)
  const recentServices = [...services]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Get car details for a reminder
  const getCarDetails = (carId: number) => {
    const car = cars.find((c) => c.id === carId)
    return car ? `${car.make} ${car.model} (${car.licensePlate})` : "Unknown Vehicle"
  }

  // Calculate days until a date
  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {currentUser
            ? `Welcome to your Gari Langu dashboard, ${currentUser.name}.`
            : "Welcome to your Gari Langu dashboard."}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cars.length}</div>
            {cars.length === 0 ? (
              <div className="mt-2">
                <Link href="/dashboard/cars/add">
                  <Button variant="link" className="h-auto p-0 text-xs text-primary">
                    Add your first car <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {cars.length > 1 ? `${cars.length} vehicles registered` : "1 vehicle registered"}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Services</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingReminders.length}</div>
            {upcomingReminders.length === 0 ? (
              <div className="mt-2">
                <Link href="/dashboard/reminders/add">
                  <Button variant="link" className="h-auto p-0 text-xs text-primary">
                    Schedule a service <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Next service in {getDaysUntil(upcomingReminders[0].dueDate)} days
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Services</CardTitle>
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
              className="lucide lucide-check-circle h-4 w-4 text-muted-foreground"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            {services.length === 0 ? (
              <div className="mt-2">
                <Link href="/dashboard/history">
                  <Button variant="link" className="h-auto p-0 text-xs text-primary">
                    Add service record <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Last service on {new Date(services[0].date).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity and Reminders */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent car-related activities</CardDescription>
          </CardHeader>
          <CardContent>
            {cars.length === 0 && services.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Car className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-sm font-medium">No recent activity</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Add a car or service record to see your activity here.
                </p>
                <div className="mt-4 flex gap-2">
                  <Link href="/dashboard/cars/add">
                    <Button size="sm" variant="outline">
                      <Plus className="mr-1 h-3 w-3" /> Add Car
                    </Button>
                  </Link>
                  <Link href="/dashboard/history">
                    <Button size="sm" variant="outline">
                      <Plus className="mr-1 h-3 w-3" /> Add Service
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Show recently added cars */}
                {cars.slice(0, 2).map((car) => (
                  <div key={`car-${car.id}`} className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Car className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Added new car</p>
                      <p className="text-sm text-muted-foreground">
                        {car.make} {car.model} ({car.licensePlate})
                      </p>
                      <p className="text-xs text-muted-foreground">Recently added</p>
                    </div>
                  </div>
                ))}

                {/* Show recent services */}
                {recentServices.slice(0, 2).map((service) => (
                  <div key={`service-${service.id}`} className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Wrench className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Service completed</p>
                      <p className="text-sm text-muted-foreground">
                        {getCarDetails(service.carId)} - {service.type}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(service.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
            <CardDescription>Scheduled maintenance for your vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingReminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-sm font-medium">No upcoming reminders</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Schedule maintenance reminders to keep your vehicles in top condition.
                </p>
                <Link href="/dashboard/reminders/add" className="mt-4">
                  <Button size="sm">
                    <Plus className="mr-1 h-3 w-3" /> Add Reminder
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingReminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="flex items-center gap-4">
                    <div className="rounded-full bg-yellow-500/10 p-2">
                      <Bell className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{reminder.serviceType}</p>
                      <p className="text-sm text-muted-foreground">{getCarDetails(reminder.carId)}</p>
                      <p className="text-xs text-muted-foreground">Due in {getDaysUntil(reminder.dueDate)} days</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
