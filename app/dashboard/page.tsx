"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCarStore } from "@/lib/car-store"
import { useServiceStore } from "@/lib/service-store"
import { useReminderStore } from "@/lib/reminder-store"
import { useAuthStore } from "@/lib/auth-store"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Car, Plus, Wrench, Bell, ArrowRight, CreditCard } from "lucide-react"
import Link from "next/link"
import { differenceInDays } from "date-fns"
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from("users").select("*").limit(1);
      if (error) {
        console.error("Supabase connection error:", error);
      } else {
        console.log("Supabase connection success! Sample data:", data);
      }
    }
    testConnection();
  }, []);
  const { cars } = useCarStore()
  const { services } = useServiceStore()
  const { reminders } = useReminderStore()
  const { user, isTrialActive, trialEnd, isRestricted } = useAuthStore()
  const { t } = useLanguage()

  // Simulate subscription info (replace with real values if available)
  // You may want to fetch these from the user profile or store
  const isSubscribed = false // TODO: Replace with real subscription status if available
  const subscriptionEndDate = null // TODO: Replace with real subscription end date if available

  if (isRestricted) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Access Restricted</h2>
        <p className="mb-4 text-lg">Your free trial has ended and you do not have an active subscription.</p>
        <p className="mb-6 text-md">Please subscribe to continue using Gari Langu features.</p>
        <Link href="/dashboard/subscription">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">Go to Subscription Page</Button>
        </Link>
      </div>
    )
  }

  // Get upcoming reminders (due in the next 30 days)
  const upcomingReminders = reminders
    .filter((reminder) => {
      const dueDate = new Date(reminder.due_date)
      const today = new Date()
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(today.getDate() + 30)
      return dueDate <= thirtyDaysFromNow && reminder.status !== "completed"
    })
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

  // Get recent services (last 5)
  const recentServices = [...services]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Get car details for a reminder
  const getCarDetails = (car_id: number) => {
    const car = cars.find((c) => c.id === car_id)
    return car ? `${car.make} ${car.model} (${car.license_plate})` : "Unknown Vehicle"
  }

  // Calculate days until a date
  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  function DaysStatus({ user }: { user: any }) {
    if (!user) return null
    const now = new Date()
    if (user.isSubscribed && user.subscriptionEndDate) {
      const days = differenceInDays(new Date(user.subscriptionEndDate), now)
      if (days < 0) return <Button size="sm" variant="destructive" className="ml-2 px-2 py-0.5 text-xs h-6">Subscription expired</Button>
      return <Button size="sm" variant="outline" className="ml-2 px-2 py-0.5 text-xs h-6 text-green-700 border-green-300">{days} days left (paid)</Button>
    } else {
      const days = differenceInDays(new Date(user.trialEndDate), now)
      if (days < 0) return <Button size="sm" variant="destructive" className="ml-2 px-2 py-0.5 text-xs h-6">Trial expired</Button>
      return <Button size="sm" variant="outline" className="ml-2 px-2 py-0.5 text-xs h-6 text-yellow-700 border-yellow-300">{days} days left (trial)</Button>
    }
  }

  return (
    <div className="space-y-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">Dashboard</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {user
              ? `Welcome to your Gari Langu dashboard, ${user.email}.`
              : "Welcome to your Gari Langu dashboard."}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href="/dashboard/cars/add">
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Add Car
            </Button>
          </Link>
          <Link href="/dashboard/reminders/add">
            <Button size="sm" className="bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md">
              <Bell className="mr-2 h-4 w-4" /> Schedule Reminder
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-200">Total Cars</CardTitle>
            <Car className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{cars.length}</div>
            </div>
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

        <Card className={
          isSubscribed && subscriptionEndDate && differenceInDays(new Date(subscriptionEndDate), new Date()) >= 0
            ? "shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800"
            : !isSubscribed && trialEnd && differenceInDays(new Date(trialEnd), new Date()) >= 0
            ? "shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800"
            : "shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800"
        }>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isSubscribed ? "Subscription Status" : "Trial Status"}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold ">
              {(() => {
                if (isSubscribed && subscriptionEndDate) {
                  const days = differenceInDays(new Date(subscriptionEndDate), new Date())
                  if (days < 0) return <span className="text-red-700">Expired</span>
                  return <span className="text-green-700">{days} days</span>
                } else if (trialEnd) {
                  const days = differenceInDays(new Date(trialEnd), new Date())
                  if (days < 0) return <span className="text-red-700">Expired</span>
                  return <span className="text-yellow-700">{days} days</span>
                } else {
                  return <span className="text-red-700">Unknown</span>
                }
              })()}
            </div>
            <p className="text-xs mt-2">
              {(() => {
                if (isSubscribed && subscriptionEndDate) {
                  const days = differenceInDays(new Date(subscriptionEndDate), new Date())
                  if (days < 0) return "Your subscription has expired."
                  return "Paid subscription"
                } else if (trialEnd) {
                  const days = differenceInDays(new Date(trialEnd), new Date())
                  if (days < 0) return "Your trial has expired."
                  return "Trial period"
                } else {
                  return "No status available."
                }
              })()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-pink-100 dark:from-slate-800 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-900 dark:text-orange-200">Upcoming Services</CardTitle>
            <Wrench className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-orange-900 dark:text-orange-200">{upcomingReminders.length}</div>
            {upcomingReminders.length === 0 ? (
              <div className="mt-2">
                <Link href="/dashboard/reminders/add">
                  <Button variant="link" className="h-auto p-0 text-xs text-orange-600">
                    Schedule a service <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {(() => {
                  const days = getDaysUntil(upcomingReminders[0].due_date)
                  if (days < 0) return `Overdue by ${Math.abs(days)} days`
                  return `Next service in ${days} days`
                })()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-teal-100 dark:from-slate-800 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-900 dark:text-green-200">Recent Services</CardTitle>
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
              className="lucide lucide-check-circle h-5 w-5 text-green-500"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-green-900 dark:text-green-200">{services.length}</div>
            {services.length === 0 ? (
              <div className="mt-2">
                <Link href="/dashboard/history">
                  <Button variant="link" className="h-auto p-0 text-xs text-green-600">
                    Add service record <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-xs text-green-700 dark:text-green-300">
                Last service on {new Date(services[0].date).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity and Reminders */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md border-0">
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
                        {car.make} {car.model} ({car.license_plate})
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
                        {getCarDetails(service.car_id)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(service.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
            <CardDescription>Stay on top of your car maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingReminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-sm font-medium">No upcoming reminders</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Schedule a reminder to get notified about upcoming services.
                </p>
                <div className="mt-4">
                  <Link href="/dashboard/reminders/add">
                    <Button size="sm" variant="outline">
                      <Plus className="mr-1 h-3 w-3" /> Add Reminder
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingReminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="flex items-center gap-4">
                    <div className="rounded-full bg-orange-100 p-2">
                      <Bell className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{reminder.service_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {getCarDetails(reminder.car_id)}
                      </p>
                      <p className="text-xs text-orange-600">
                        Due in {getDaysUntil(reminder.due_date)} days
                      </p>
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
