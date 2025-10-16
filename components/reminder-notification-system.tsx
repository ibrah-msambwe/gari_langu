"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useReminderStore } from "@/lib/reminder-store"
import { useCarStore } from "@/lib/car-store"
import { useAuthStore } from "@/lib/auth-store"
import { useNotificationStore } from "@/lib/notification-store"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useServiceStore } from "@/lib/service-store"

export function ReminderNotificationSystem() {
  const { reminders, updateReminder } = useReminderStore()
  const { cars } = useCarStore()
  const { currentUser } = useAuthStore()
  const { sendReminderNotification } = useNotificationStore()
  const { addService } = useServiceStore()
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sentCount, setSentCount] = useState(0)

  // Get upcoming reminders (due in the next 30 days)
  const upcomingReminders = reminders.filter((reminder) => {
    const dueDate = new Date(reminder.dueDate)
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)
    return dueDate <= thirtyDaysFromNow && reminder.status !== "completed" && !reminder.notificationSent
  })

  const getCarDetails = (carId: number) => {
    const car = cars.find((c) => c.id === carId)
    return car ? `${car.make} ${car.model} (${car.license_plate})` : "Unknown Vehicle"
  }

  const getDaysUntil = (dateString: string) => {
    const dateObj = new Date(dateString)
    const today = new Date()
    const diffTime = dateObj.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleSendNotifications = () => {
    if (upcomingReminders.length === 0) {
      toast({
        title: "No notifications to send",
        description: "There are no upcoming reminders that need notifications.",
      })
      return
    }

    setIsSending(true)
    setProgress(0)
    setSentCount(0)

    // Simulate sending notifications with progress updates
    let count = 0
    const totalReminders = upcomingReminders.length

    const interval = setInterval(() => {
      if (count >= totalReminders) {
        clearInterval(interval)
        setIsSending(false)
        toast({
          title: "Notifications sent",
          description: `Successfully sent ${totalReminders} reminder notifications.`,
        })
        return
      }

      count++
      setSentCount(count)
      setProgress(Math.round((count / totalReminders) * 100))

      // Mark the reminder as notified
      const reminder = upcomingReminders[count - 1]
      updateReminder(reminder.id, { notificationSent: true })

      // Send actual notification
      if (currentUser) {
        sendReminderNotification(currentUser.id, reminder.serviceType, reminder.dueDate)
      }

      // Note: Service history is auto-created when reminder is marked as complete
      // We don't add it here, only mark notification as sent
    }, 800)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Reminder Notifications
        </CardTitle>
        <CardDescription>Send and manage service reminder notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingReminders.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>All caught up!</AlertTitle>
            <AlertDescription>
              There are no pending notifications to send. All upcoming reminders have been notified.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pending Notifications</AlertTitle>
              <AlertDescription>
                You have {upcomingReminders.length} upcoming service reminders that need notifications.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 mt-4">
              <h3 className="text-sm font-medium">Notification Methods</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">Email: {currentUser?.email || "Not set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">SMS: {currentUser?.phone || "Not set"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-medium">Upcoming Reminders</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {upcomingReminders.map((reminder) => (
                  <div key={reminder.id} className="flex justify-between items-center border rounded-md p-3">
                    <div>
                      <p className="font-medium">{reminder.serviceType}</p>
                      <p className="text-sm text-muted-foreground">{getCarDetails(reminder.carId)}</p>
                      <p className="text-xs">Due in {getDaysUntil(reminder.dueDate)} days</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {reminder.notificationTypes.includes("email") && (
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      )}
                      {reminder.notificationTypes.includes("sms") && (
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isSending && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sending notifications...</span>
                  <span className="text-sm">
                    {sentCount}/{upcomingReminders.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSendNotifications}
          disabled={isSending || upcomingReminders.length === 0}
        >
          {isSending ? <>Sending Notifications...</> : <>Send {upcomingReminders.length} Notifications</>}
        </Button>
      </CardFooter>
    </Card>
  )
}
