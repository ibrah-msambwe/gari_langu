"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Send } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminNotificationsPage() {
  const { users } = useAuthStore()
  const { toast } = useToast()
  const [notificationType, setNotificationType] = useState<"all" | "active" | "expired" | "pending">("all")
  const [notificationSubject, setNotificationSubject] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [isSending, setIsSending] = useState(false)

  // Filter users based on notification type
  const filteredUsers = users.filter((user) => {
    if (notificationType === "all") return true

    if (notificationType === "active") {
      return user.isSubscribed && user.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date()
    }

    if (notificationType === "expired") {
      return !user.isSubscribed || !user.subscriptionEndDate || new Date(user.subscriptionEndDate) <= new Date()
    }

    if (notificationType === "pending") {
      return !!user.pendingPayment
    }

    return true
  })

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      // If all are selected, deselect all
      setSelectedUsers([])
    } else {
      // Otherwise select all
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const handleToggleUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleSendNotification = () => {
    if (!notificationSubject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter a notification subject",
        variant: "destructive",
      })
      return
    }

    if (!notificationMessage.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a notification message",
        variant: "destructive",
      })
      return
    }

    if (selectedUsers.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one user to receive the notification",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    // Simulate sending notifications
    setTimeout(() => {
      setIsSending(false)

      toast({
        title: "Notifications sent",
        description: `Successfully sent notifications to ${selectedUsers.length} users.`,
      })

      // Reset form
      setNotificationSubject("")
      setNotificationMessage("")
      setSelectedUsers([])
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Send notifications to users</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Compose Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Notification subject"
                  value={notificationSubject}
                  onChange={(e) => setNotificationSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your notification message here..."
                  className="min-h-[200px]"
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleSendNotification} disabled={isSending}>
                {isSending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Notification to {selectedUsers.length} Users
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="filter-type">Filter Users</Label>
                <Select
                  value={notificationType}
                  onValueChange={(value: "all" | "active" | "expired" | "pending") => setNotificationType(value)}
                >
                  <SelectTrigger id="filter-type">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active Subscriptions</SelectItem>
                    <SelectItem value="expired">Expired Subscriptions</SelectItem>
                    <SelectItem value="pending">Pending Payments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all">Select All ({filteredUsers.length})</Label>
              </div>

              <div className="border rounded-md max-h-[400px] overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No users match the selected filter</div>
                ) : (
                  <div className="divide-y">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="p-2 hover:bg-muted/50">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleToggleUser(user.id)}
                          />
                          <Label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                              <div>
                                {user.isSubscribed &&
                                user.subscriptionEndDate &&
                                new Date(user.subscriptionEndDate) > new Date() ? (
                                  <Badge className="bg-green-500">Active</Badge>
                                ) : user.pendingPayment ? (
                                  <Badge className="bg-yellow-500">Pending</Badge>
                                ) : (
                                  <Badge variant="outline">Inactive</Badge>
                                )}
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">{selectedUsers.length} users selected</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="payment">
            <TabsList>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="announcement">Announcement</TabsTrigger>
            </TabsList>
            <TabsContent value="payment" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h3 className="font-medium">Payment Confirmation</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNotificationSubject("Payment Confirmed")
                    setNotificationMessage(
                      "Dear user,\n\nYour payment has been successfully verified. Your subscription has been extended according to your payment plan.\n\nThank you for using Gari Langu!",
                    )
                  }}
                >
                  Use Template
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Payment Rejected</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNotificationSubject("Payment Rejected")
                    setNotificationMessage(
                      "Dear user,\n\nUnfortunately, we could not verify your recent payment. Please ensure you've sent the correct amount to the right account and try submitting your verification again.\n\nIf you need assistance, please contact our support team.",
                    )
                  }}
                >
                  Use Template
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="subscription" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h3 className="font-medium">Subscription Expiring</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNotificationSubject("Your Subscription is Expiring Soon")
                    setNotificationMessage(
                      "Dear user,\n\nYour Gari Langu subscription will expire in 7 days. To continue enjoying our services without interruption, please renew your subscription.\n\nThank you for using Gari Langu!",
                    )
                  }}
                >
                  Use Template
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Subscription Expired</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNotificationSubject("Your Subscription Has Expired")
                    setNotificationMessage(
                      "Dear user,\n\nYour Gari Langu subscription has expired. To regain access to all features, please renew your subscription.\n\nThank you for using Gari Langu!",
                    )
                  }}
                >
                  Use Template
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="announcement" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h3 className="font-medium">New Feature Announcement</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNotificationSubject("New Features Available!")
                    setNotificationMessage(
                      "Dear user,\n\nWe're excited to announce that we've added new features to Gari Langu! Log in to check them out.\n\nThank you for using Gari Langu!",
                    )
                  }}
                >
                  Use Template
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Maintenance Announcement</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNotificationSubject("Scheduled Maintenance")
                    setNotificationMessage(
                      "Dear user,\n\nWe will be performing scheduled maintenance on our servers on [DATE] from [TIME] to [TIME]. During this period, Gari Langu may be temporarily unavailable.\n\nWe apologize for any inconvenience and thank you for your understanding.",
                    )
                  }}
                >
                  Use Template
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
