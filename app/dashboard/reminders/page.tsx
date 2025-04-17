"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Edit,
  Mail,
  MoreHorizontal,
  Phone,
  Trash2,
  WrenchIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useReminderStore } from "@/lib/reminder-store"
import { useCarStore } from "@/lib/car-store"
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
import { useLanguage } from "@/components/language-provider"
import { ReminderNotificationSystem } from "@/components/reminder-notification-system"

export default function RemindersPage() {
  const { reminders, deleteReminder, markAsComplete } = useReminderStore()
  const { getCar } = useCarStore()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [reminderToDelete, setReminderToDelete] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcomingReminders = reminders.filter((r) => r.status === "upcoming")
  const futureReminders = reminders.filter((r) => r.status === "future")
  const completedReminders = reminders.filter((r) => r.status === "completed")

  const handleDeleteReminder = (id: number) => {
    deleteReminder(id)
    toast({
      title: "Reminder deleted",
      description: "The service reminder has been removed successfully.",
    })
    setReminderToDelete(null)
  }

  const handleMarkAsComplete = (id: number) => {
    markAsComplete(id)
    toast({
      title: "Reminder completed",
      description: "The service reminder has been marked as completed.",
    })
  }

  const handleSendNotification = (id: number) => {
    toast({
      title: "Notification sent",
      description: "The service reminder notification has been sent.",
    })
  }

  function getPriorityBadge(priority: string) {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>
      case "low":
        return <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>
      default:
        return null
    }
  }

  function getNotificationIcons(types: string[]) {
    return (
      <div className="flex space-x-1">
        {types.includes("email") && <Mail className="h-4 w-4 text-muted-foreground" />}
        {types.includes("sms") && <Phone className="h-4 w-4 text-muted-foreground" />}
      </div>
    )
  }

  function getCarDetails(carId: number) {
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
          <h1 className="text-3xl font-bold tracking-tight">Service Reminders</h1>
          <p className="text-muted-foreground">Manage maintenance reminders for your vehicles</p>
        </div>
        <Link href="/dashboard/reminders/add">
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            Add Reminder
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Upcoming ({upcomingReminders.length})</span>
              </TabsTrigger>
              <TabsTrigger value="future" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Future ({futureReminders.length})</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Completed ({completedReminders.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Service Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingReminders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                          <Bell className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No upcoming reminders</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          You don't have any upcoming service reminders.
                        </p>
                        <Link href="/dashboard/reminders/add" className="mt-4">
                          <Button>
                            <Bell className="mr-2 h-4 w-4" />
                            Add Reminder
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      upcomingReminders.map((reminder) => {
                        const car = getCarDetails(reminder.carId)
                        return (
                          <div
                            key={reminder.id}
                            className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <WrenchIcon className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold">{reminder.serviceType}</h3>
                                {getPriorityBadge(reminder.priority)}
                                {reminder.notificationSent && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    Notified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {car.make} {car.model} ({car.licensePlate})
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium">
                                  Due: {new Date(reminder.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Notification: {reminder.notificationSchedule}
                                </p>
                                {getNotificationIcons(reminder.notificationTypes)}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/reminders/${reminder.id}/edit`}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Edit</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleMarkAsComplete(reminder.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    <span>Mark as Complete</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSendNotification(reminder.id)}>
                                    <Bell className="mr-2 h-4 w-4" />
                                    <span>Send Notification Now</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => setReminderToDelete(reminder.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="future">
              <Card>
                <CardHeader>
                  <CardTitle>Future Service Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {futureReminders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                          <Calendar className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No future reminders</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          You don't have any future service reminders scheduled.
                        </p>
                        <Link href="/dashboard/reminders/add" className="mt-4">
                          <Button>
                            <Bell className="mr-2 h-4 w-4" />
                            Add Reminder
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      futureReminders.map((reminder) => {
                        const car = getCarDetails(reminder.carId)
                        return (
                          <div
                            key={reminder.id}
                            className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <WrenchIcon className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold">{reminder.serviceType}</h3>
                                {getPriorityBadge(reminder.priority)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {car.make} {car.model} ({car.licensePlate})
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium">
                                  Due: {new Date(reminder.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Notification: {reminder.notificationSchedule}
                                </p>
                                {getNotificationIcons(reminder.notificationTypes)}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/reminders/${reminder.id}/edit`}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Edit</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSendNotification(reminder.id)}>
                                    <Bell className="mr-2 h-4 w-4" />
                                    <span>Send Notification Now</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => setReminderToDelete(reminder.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Service Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedReminders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                          <CheckCircle className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No completed reminders</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          You don't have any completed service reminders.
                        </p>
                      </div>
                    ) : (
                      completedReminders.map((reminder) => {
                        const car = getCarDetails(reminder.carId)
                        return (
                          <div
                            key={reminder.id}
                            className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <h3 className="font-semibold">{reminder.serviceType}</h3>
                              </div>
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {car.make} {car.model} ({car.licensePlate})
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Completed:{" "}
                                  {reminder.completedDate
                                    ? new Date(reminder.completedDate).toLocaleDateString()
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500"
                                onClick={() => setReminderToDelete(reminder.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <ReminderNotificationSystem />
        </div>
      </div>

      <AlertDialog open={reminderToDelete !== null} onOpenChange={(open) => !open && setReminderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this reminder?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service reminder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => reminderToDelete !== null && handleDeleteReminder(reminderToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
