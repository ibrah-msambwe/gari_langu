"use client"

import { Badge } from "@/components/ui/badge"

import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, Bell, BarChart } from "lucide-react"
import { AdminNotifications } from "@/components/admin-notifications"

export default function AdminDashboard() {
  const { users, payments } = useAuthStore()

  // Count active users
  const activeUsers = users.filter(
    (user) =>
      user.isActive !== false && !user.isAdmin && (user.isSubscribed || new Date() <= new Date(user.trialEndDate)),
  ).length

  // Count pending payments
  const pendingPayments = payments.filter((payment) => payment.status === "pending").length

  // Calculate total revenue
  const totalRevenue = payments
    .filter((payment) => payment.status === "verified")
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => !u.isAdmin).length}</div>
            <p className="text-xs text-muted-foreground">{activeUsers} active users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} TZS</div>
            <p className="text-xs text-muted-foreground">
              From {payments.filter((p) => p.status === "verified").length} verified payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AdminNotifications />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Recently registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {users
              .filter((u) => !u.isAdmin)
              .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
              .slice(0, 5)
              .map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Recently submitted payments</CardDescription>
          </CardHeader>
          <CardContent>
            {payments
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((payment) => {
                const user = users.find((u) => u.id === payment.userId)
                return (
                  <div key={payment.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{user?.name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.amount.toLocaleString()} TZS • {payment.method}
                      </p>
                    </div>
                    <div>
                      {payment.status === "pending" && <Badge className="bg-yellow-500">Pending</Badge>}
                      {payment.status === "verified" && <Badge className="bg-green-500">Verified</Badge>}
                      {payment.status === "rejected" && (
                        <Badge variant="outline" className="border-red-200 text-red-700">
                          Rejected
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
