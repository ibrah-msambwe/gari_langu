"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Smartphone, CheckCircle, Send, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function MobileAppDownload() {
  const { currentUser } = useAuthStore()
  const { toast } = useToast()
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || "")
  const [isLoading, setIsLoading] = useState(false)
  const [linkSent, setLinkSent] = useState(false)

  const handleSendLink = () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to receive the download link",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate sending SMS
    setTimeout(() => {
      setIsLoading(false)
      setLinkSent(true)
      toast({
        title: "Download link sent",
        description: "A download link has been sent to your phone",
      })
    }, 1500)
  }

  const handleDirectDownload = () => {
    // In a real app, this would trigger the appropriate app store link based on device detection
    toast({
      title: "Download started",
      description: "Your download should begin automatically",
    })

    // Simulate download starting
    setTimeout(() => {
      window.open("https://play.google.com/store", "_blank")
    }, 500)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" /> Gari Langu Mobile App
        </CardTitle>
        <CardDescription>Download our mobile app to manage your vehicles on the go</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Mobile App Coming Soon</AlertTitle>
          <AlertDescription>
            Our mobile app is currently in development and will be available soon. You can pre-register below to be
            notified when it launches.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="preregister" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preregister">
              <Send className="mr-2 h-4 w-4" /> Pre-register
            </TabsTrigger>
            <TabsTrigger value="features">
              <Smartphone className="mr-2 h-4 w-4" /> Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preregister" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+255 712 815 726"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We'll send you a notification when the app is available for download
                </p>
              </div>

              {linkSent ? (
                <div className="flex items-center justify-center p-4 bg-primary/10 rounded-md">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-8 w-8 text-primary" />
                    <p className="text-sm font-medium">Pre-registration successful!</p>
                    <p className="text-xs text-muted-foreground text-center">
                      You'll receive a notification when the app is available
                    </p>
                  </div>
                </div>
              ) : (
                <Button className="w-full" onClick={handleSendLink} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Registering...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Pre-register Now
                    </>
                  )}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-4">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Real-time Service Reminders</h4>
                    <p className="text-xs text-muted-foreground">Get timely notifications for upcoming maintenance</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Offline Access</h4>
                    <p className="text-xs text-muted-foreground">View your vehicle information even without internet</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Document Storage</h4>
                    <p className="text-xs text-muted-foreground">Store and access your vehicle documents on the go</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Fuel Tracking</h4>
                    <p className="text-xs text-muted-foreground">Monitor fuel consumption and expenses</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={() => document.getElementById("preregister-tab")?.click()}>
                  <Send className="mr-2 h-4 w-4" />
                  Pre-register Now
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">Will be available for Android and iOS devices</p>
      </CardFooter>
    </Card>
  )
}
