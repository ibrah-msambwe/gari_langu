"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    tigoEnabled: true,
    mpesaEnabled: true,
    airtelEnabled: true,
    tigoNumber: "0712815726",
    mpesaNumber: "0712815726",
    airtelNumber: "0712815726",
    autoApprove: false,
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    smsEnabled: true,
    paymentNotifications: true,
    subscriptionNotifications: true,
    adminNotifications: true,
  })

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    siteName: "Gari Langu",
    siteDescription: "Car Management System",
    trialDays: 7,
    maintenanceMode: false,
    debugMode: false,
  })

  const handleSavePaymentSettings = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Payment settings have been updated successfully.",
      })
    }, 1000)
  }

  const handleSaveNotificationSettings = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Notification settings have been updated successfully.",
      })
    }, 1000)
  }

  const handleSaveSystemSettings = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "System settings have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">Configure system settings and preferences</p>
      </div>

      <Tabs defaultValue="payment">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payment">Payment Settings</TabsTrigger>
          <TabsTrigger value="notification">Notification Settings</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure available payment methods and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Tigo Pesa</h3>
                    <p className="text-sm text-muted-foreground">Enable or disable Tigo Pesa payments</p>
                  </div>
                  <Switch
                    checked={paymentSettings.tigoEnabled}
                    onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, tigoEnabled: checked })}
                  />
                </div>

                {paymentSettings.tigoEnabled && (
                  <div className="space-y-2 pl-6 border-l-2 border-muted">
                    <Label htmlFor="tigo-number">Tigo Pesa Number</Label>
                    <Input
                      id="tigo-number"
                      value={paymentSettings.tigoNumber}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, tigoNumber: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">M-Pesa</h3>
                    <p className="text-sm text-muted-foreground">Enable or disable M-Pesa payments</p>
                  </div>
                  <Switch
                    checked={paymentSettings.mpesaEnabled}
                    onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, mpesaEnabled: checked })}
                  />
                </div>

                {paymentSettings.mpesaEnabled && (
                  <div className="space-y-2 pl-6 border-l-2 border-muted">
                    <Label htmlFor="mpesa-number">M-Pesa Number</Label>
                    <Input
                      id="mpesa-number"
                      value={paymentSettings.mpesaNumber}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, mpesaNumber: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Airtel Money</h3>
                    <p className="text-sm text-muted-foreground">Enable or disable Airtel Money payments</p>
                  </div>
                  <Switch
                    checked={paymentSettings.airtelEnabled}
                    onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, airtelEnabled: checked })}
                  />
                </div>

                {paymentSettings.airtelEnabled && (
                  <div className="space-y-2 pl-6 border-l-2 border-muted">
                    <Label htmlFor="airtel-number">Airtel Money Number</Label>
                    <Input
                      id="airtel-number"
                      value={paymentSettings.airtelNumber}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, airtelNumber: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-approve Payments</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve payments without manual verification
                    </p>
                  </div>
                  <Switch
                    checked={paymentSettings.autoApprove}
                    onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, autoApprove: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePaymentSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Payment Settings"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Configure subscription plans and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Monthly Plan</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="monthly-price" className="text-xs">
                      Price (TZS)
                    </Label>
                    <Input id="monthly-price" defaultValue="1000" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="monthly-duration" className="text-xs">
                      Duration (days)
                    </Label>
                    <Input id="monthly-duration" defaultValue="30" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quarterly Plan</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="quarterly-price" className="text-xs">
                      Price (TZS)
                    </Label>
                    <Input id="quarterly-price" defaultValue="2700" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="quarterly-duration" className="text-xs">
                      Duration (days)
                    </Label>
                    <Input id="quarterly-duration" defaultValue="90" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Annual Plan</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="annual-price" className="text-xs">
                      Price (TZS)
                    </Label>
                    <Input id="annual-price" defaultValue="10000" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="annual-duration" className="text-xs">
                      Duration (days)
                    </Label>
                    <Input id="annual-duration" defaultValue="365" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePaymentSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Subscription Plans"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notification" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Configure notification delivery methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailEnabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, emailEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsEnabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, smsEnabled: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotificationSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Notification Channels"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Events</CardTitle>
              <CardDescription>Configure which events trigger notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Payment Notifications</h3>
                    <p className="text-sm text-muted-foreground">Notify users about payment status changes</p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, paymentNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Subscription Notifications</h3>
                    <p className="text-sm text-muted-foreground">Notify users about subscription expiration</p>
                  </div>
                  <Switch
                    checked={notificationSettings.subscriptionNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, subscriptionNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Admin Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications about important system events</p>
                  </div>
                  <Switch
                    checked={notificationSettings.adminNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, adminNotifications: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotificationSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Notification Events"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={systemSettings.siteName}
                  onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings({ ...systemSettings, siteDescription: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trial-days">Trial Period (Days)</Label>
                <Input
                  id="trial-days"
                  type="number"
                  value={systemSettings.trialDays}
                  onChange={(e) => setSystemSettings({ ...systemSettings, trialDays: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Maintenance Mode</h3>
                    <p className="text-sm text-muted-foreground">Put the site in maintenance mode</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, maintenanceMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Debug Mode</h3>
                    <p className="text-sm text-muted-foreground">Enable detailed error messages</p>
                  </div>
                  <Switch
                    checked={systemSettings.debugMode}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, debugMode: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSystemSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save System Settings"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Perform system maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Database Backup</h3>
                <p className="text-sm text-muted-foreground">Create a backup of the system database</p>
                <Button variant="outline">Create Backup</Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Clear Cache</h3>
                <p className="text-sm text-muted-foreground">Clear system cache to improve performance</p>
                <Button variant="outline">Clear Cache</Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">System Logs</h3>
                <p className="text-sm text-muted-foreground">View and download system logs</p>
                <Button variant="outline">View Logs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
