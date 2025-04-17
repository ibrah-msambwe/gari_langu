"use client"

import { useState, useEffect } from "react"
import { useNotificationStore } from "@/lib/notification-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Mail, MessageSquare, Trash2, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export function AdminNotifications() {
  const { getAdminNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount } =
    useNotificationStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")
  const [unreadCount, setUnreadCount] = useState(0)

  // Get all admin notifications
  const adminNotifications = getAdminNotifications()

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === "all" ? adminNotifications : adminNotifications.filter((n) => n.status === "unread")

  // Update unread count
  useEffect(() => {
    setUnreadCount(getUnreadCount("admin"))
  }, [adminNotifications, getUnreadCount])

  const handleMarkAllAsRead = () => {
    markAllAsRead("admin")
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read.",
    })
  }

  const handleMarkAsRead = (id: number) => {
    markAsRead(id)
  }

  const handleDelete = (id: number) => {
    deleteNotification(id)
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted.",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />
      case "sms":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-amber-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Notifications
          {unreadCount > 0 && <Badge className="ml-2 bg-primary">{unreadCount}</Badge>}
        </CardTitle>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "unread")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && <Badge className="ml-2 bg-primary">{unreadCount}</Badge>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="pt-4">
            {renderNotificationList(filteredNotifications)}
          </TabsContent>
          <TabsContent value="unread" className="pt-4">
            {renderNotificationList(filteredNotifications)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  function renderNotificationList(notifications: ReturnType<typeof getAdminNotifications>) {
    if (notifications.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No notifications found</p>
        </div>
      )
    }

    return (
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`border rounded-md p-3 ${notification.status === "unread" ? "bg-muted/50" : ""}`}
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                {getNotificationIcon(notification.type)}
                <span className="font-medium">{notification.title}</span>
              </div>
              <div className="flex gap-1">
                {notification.status === "unread" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-500"
                  onClick={() => handleDelete(notification.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            <p className="text-sm mt-1">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.createdAt)}</p>
          </div>
        ))}
      </div>
    )
  }
}
