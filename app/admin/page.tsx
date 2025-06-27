"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, Bell, BarChart, Loader2 } from "lucide-react"
import { AdminNotifications } from "@/components/admin-notifications"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { useNotificationStore } from "@/lib/notification-store"

function AddUserModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { registerUser } = useAuthStore()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", language: "en" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const newUserId = registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      language: form.language as "en" | "sw",
    })
    useNotificationStore.getState().sendUserRegistrationNotification(newUserId, form.name, form.email)
    setLoading(false)
    toast({ title: "User added", description: `User ${form.name} has been created.` })
    setForm({ name: "", email: "", password: "", phone: "", language: "en" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
              <SelectTrigger id="language" name="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="sw">Swahili</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function VerifyPaymentModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { payments, users, updatePaymentStatus } = useAuthStore()
  const { toast } = useToast()
  const [selected, setSelected] = useState<number | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const pendingPayments = payments.filter((p) => p.status === "pending")
  const selectedPayment = selected !== null ? payments.find((p) => p.id === selected) : null
  const selectedUser = selectedPayment ? users.find((u) => u.id === selectedPayment.userId) : null

  const handleApprove = () => {
    if (!selectedPayment) return
    updatePaymentStatus(selectedPayment.id, "verified", adminNotes)
    toast({ title: "Payment approved", description: "Payment has been verified." })
    setSelected(null)
    setAdminNotes("")
    onOpenChange(false)
  }
  const handleReject = () => {
    if (!selectedPayment) return
    updatePaymentStatus(selectedPayment.id, "rejected", adminNotes)
    toast({ title: "Payment rejected", description: "Payment has been rejected." })
    setSelected(null)
    setAdminNotes("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Verify Payment</DialogTitle>
        </DialogHeader>
        {pendingPayments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No pending payments.</div>
        ) : selectedPayment ? (
          <div className="space-y-4">
            <div>
              <div className="font-medium">User: {selectedUser?.name} ({selectedUser?.email})</div>
              <div>Amount: <span className="font-semibold">{selectedPayment.amount.toLocaleString()} TZS</span></div>
              <div>Method: {selectedPayment.method}</div>
              <div>Date: {new Date(selectedPayment.date).toLocaleDateString()}</div>
              <div>Months: {selectedPayment.months}</div>
            </div>
            <div>
              <Label htmlFor="adminNotes">Admin Notes</Label>
              <Input id="adminNotes" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} />
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="destructive" onClick={handleReject}>Reject</Button>
              <Button onClick={handleApprove}>Approve</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingPayments.map((p) => {
              const user = users.find((u) => u.id === p.userId)
              return (
                <div key={p.id} className="flex items-center justify-between border rounded-lg p-3 mb-2">
                  <div>
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                    <div className="text-xs">{p.amount.toLocaleString()} TZS • {p.method}</div>
                  </div>
                  <Button size="sm" onClick={() => setSelected(p.id)}>Review</Button>
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function AdminDashboard() {
  const { users, payments, updateUser } = useAuthStore()
  const { toast } = useToast()
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [verifyPaymentOpen, setVerifyPaymentOpen] = useState(false)
  const [addUserLoading, setAddUserLoading] = useState(false)
  const [verifyPaymentLoading, setVerifyPaymentLoading] = useState(false)

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

  // Chart data: users registered per day (last 7 days)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateString = date.toLocaleDateString()
    const count = users.filter(
      (u) => new Date(u.registrationDate).toLocaleDateString() === dateString && !u.isAdmin
    ).length
    return { date: dateString, Users: count }
  })

  // Admin test utilities
  const expireTrial = () => {
    if (users.length > 0) {
      updateUser(users[0].id, { trialEndDate: new Date(Date.now() - 86400000).toISOString() })
    }
  }
  const expireSubscription = () => {
    if (users.length > 0) {
      updateUser(users[0].id, { subscriptionEndDate: new Date(Date.now() - 86400000).toISOString() })
    }
  }

  return (
    <div className="space-y-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">Admin Dashboard</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">Overview of your system</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
            onClick={() => {
              setAddUserLoading(true)
              setAddUserOpen(true)
            }}
            disabled={addUserLoading}
          >
            {addUserLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add User
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md"
            onClick={() => {
              setVerifyPaymentLoading(true)
              setVerifyPaymentOpen(true)
            }}
            disabled={verifyPaymentLoading}
          >
            {verifyPaymentLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verify Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-200">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-900 dark:text-blue-200">{users.filter((u) => !u.isAdmin).length}</div>
            <p className="text-xs text-blue-700 dark:text-blue-300">{activeUsers} active users</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-teal-100 dark:from-slate-800 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-900 dark:text-green-200">Total Revenue</CardTitle>
            <BarChart className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-green-900 dark:text-green-200">{totalRevenue.toLocaleString()} TZS</div>
            <p className="text-xs text-green-700 dark:text-green-300">
              From {payments.filter((p) => p.status === "verified").length} verified payments
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-pink-100 dark:from-slate-800 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-900 dark:text-orange-200">Pending Payments</CardTitle>
            <CreditCard className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-orange-900 dark:text-orange-200">{pendingPayments}</div>
            <p className="text-xs text-orange-700 dark:text-orange-300">Awaiting verification</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900 dark:text-purple-200">User Growth</CardTitle>
            <BarChart className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="Users" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications, Users, Payments */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>System notifications</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">Mark all as read</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AdminNotifications />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="shadow-md border-0">
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
                  <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(user.registrationDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
          <Card className="shadow-md border-0">
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
                    <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{user?.name || "Unknown User"}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {payment.amount.toLocaleString()} TZS • {payment.method}
                        </p>
                      </div>
                      <div>
                        {payment.status === "pending" && <span className="inline-block rounded bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs">Pending</span>}
                        {payment.status === "verified" && <span className="inline-block rounded bg-green-100 text-green-800 px-2 py-0.5 text-xs">Verified</span>}
                        {payment.status === "rejected" && <span className="inline-block rounded border border-red-200 text-red-700 px-2 py-0.5 text-xs">Rejected</span>}
                      </div>
                    </div>
                  )
                })}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button size="sm" variant="outline" onClick={expireTrial}>Expire Trial (Test)</Button>
        <Button size="sm" variant="outline" onClick={expireSubscription}>Expire Subscription (Test)</Button>
      </div>

      <AddUserModal open={addUserOpen} onOpenChange={(open) => {
        setAddUserOpen(open)
        if (open) setAddUserLoading(false)
      }} />
      <VerifyPaymentModal open={verifyPaymentOpen} onOpenChange={(open) => {
        setVerifyPaymentOpen(open)
        if (open) setVerifyPaymentLoading(false)
      }} />
    </div>
  )
}
