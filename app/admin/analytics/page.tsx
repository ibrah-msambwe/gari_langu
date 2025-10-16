"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCars: 0,
    totalRevenue: 0,
    totalServices: 0,
    pendingPayments: 0,
    activeSubscriptions: 0,
    trialUsers: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      // Fetch all data in parallel
      const [usersData, carsData, servicesData, paymentsData] = await Promise.all([
        supabase.from("users").select("*"),
        supabase.from("cars").select("*"),
        supabase.from("services").select("*"),
        supabase.from("payments").select("*"),
      ])

      const users = usersData.data || []
      const cars = carsData.data || []
      const services = servicesData.data || []
      const payments = paymentsData.data || []

      // Calculate stats
      const now = new Date()
      const activeUsers = users.filter((u: any) => 
        (u.is_subscribed && u.subscription_end_date && new Date(u.subscription_end_date) > now) ||
        (u.trial_end && new Date(u.trial_end) > now)
      ).length

      const trialUsers = users.filter((u: any) => 
        u.trial_end && new Date(u.trial_end) > now && !u.is_subscribed
      ).length

      const activeSubscriptions = users.filter((u: any) => 
        u.is_subscribed && u.subscription_end_date && new Date(u.subscription_end_date) > now
      ).length

      const totalRevenue = payments
        .filter((p: any) => p.status === "verified")
        .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0)

      const pendingPayments = payments.filter((p: any) => p.status === "pending").length

      setStats({
        totalUsers: users.length,
        activeUsers,
        totalCars: cars.length,
        totalRevenue,
        totalServices: services.length,
        pendingPayments,
        activeSubscriptions,
        trialUsers,
      })
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-sm md:text-base text-muted-foreground">System statistics and insights</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview" className="min-h-[44px]">Overview</TabsTrigger>
          <TabsTrigger value="users" className="min-h-[44px]">Users</TabsTrigger>
          <TabsTrigger value="revenue" className="min-h-[44px]">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="card-appear elevation-2 hover:elevation-3 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                <CardTitle className="text-xs md:text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl md:text-3xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.activeUsers} active
                </p>
              </CardContent>
            </Card>

            <Card className="card-appear elevation-2 hover:elevation-3 transition-all duration-300" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                <CardTitle className="text-xs md:text-sm font-medium">Total Cars</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl md:text-3xl font-bold">{stats.totalCars}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered vehicles
                </p>
              </CardContent>
            </Card>

            <Card className="card-appear elevation-2 hover:elevation-3 transition-all duration-300" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                <CardTitle className="text-xs md:text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl md:text-3xl font-bold">{stats.totalRevenue.toLocaleString()} TZS</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All time earnings
                </p>
              </CardContent>
            </Card>

            <Card className="card-appear elevation-2 hover:elevation-3 transition-all duration-300" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                <CardTitle className="text-xs md:text-sm font-medium">Service Records</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl md:text-3xl font-bold">{stats.totalServices}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total services logged
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            <Card className="elevation-2">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Subscriptions</span>
                  <span className="text-lg font-bold text-green-600">{stats.activeSubscriptions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trial Users</span>
                  <span className="text-lg font-bold text-yellow-600">{stats.trialUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Payments</span>
                  <span className="text-lg font-bold text-orange-600">{stats.pendingPayments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avg Cars/User</span>
                  <span className="text-lg font-bold text-blue-600">
                    {stats.totalUsers > 0 ? (stats.totalCars / stats.totalUsers).toFixed(1) : "0"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="elevation-2">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Platform status indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User Engagement</span>
                  <span className="text-sm font-semibold text-green-600">
                    {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Subscription Rate</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {stats.totalUsers > 0 ? ((stats.activeSubscriptions / stats.totalUsers) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trial Conversion</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {(stats.trialUsers + stats.activeSubscriptions) > 0 
                      ? ((stats.activeSubscriptions / (stats.trialUsers + stats.activeSubscriptions)) * 100).toFixed(0) 
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Platform Status</span>
                  <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    Operational
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="card-appear elevation-2">
              <CardHeader className="p-4">
                <CardTitle className="text-sm">Total Registered</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-2">All time registrations</p>
              </CardContent>
            </Card>

            <Card className="card-appear elevation-2" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="p-4">
                <CardTitle className="text-sm">Active Users</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold text-green-600">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground mt-2">Currently active</p>
              </CardContent>
            </Card>

            <Card className="card-appear elevation-2" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="p-4">
                <CardTitle className="text-sm">Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(0) : 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">User activity rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="card-appear elevation-2">
              <CardHeader className="p-4">
                <CardTitle className="text-sm">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} TZS</div>
                <p className="text-xs text-muted-foreground mt-2">All time earnings</p>
              </CardContent>
            </Card>

            <Card className="card-appear elevation-2" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="p-4">
                <CardTitle className="text-sm">Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold text-blue-600">{stats.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground mt-2">Paying customers</p>
              </CardContent>
            </Card>

            <Card className="card-appear elevation-2" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="p-4">
                <CardTitle className="text-sm">Avg Revenue/User</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold text-purple-600">
                  {stats.activeSubscriptions > 0 
                    ? Math.round(stats.totalRevenue / stats.activeSubscriptions).toLocaleString() 
                    : 0} TZS
                </div>
                <p className="text-xs text-muted-foreground mt-2">Per paying user</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

