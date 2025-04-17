"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/lib/auth-store"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useUserStore } from "@/lib/user-store"
import { Bell, Globe, Moon, Shield, Smartphone, User } from "lucide-react"
import { MobileAppDownload } from "@/components/mobile-app-download"

export default function SettingsPage() {
  const { currentUser, updateCurrentUser } = useAuthStore()
  const { preferences, updatePreferences } = useUserStore()
  const { toast } = useToast()
  const { t, setLanguage } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(currentUser?.avatar || null)

  if (!currentUser) {
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    // Update user profile
    updateCurrentUser({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      avatar: previewImage || undefined,
    })

    // Show success toast
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleLanguageChange = (value: string) => {
    setIsLoading(true)

    // Update language
    setLanguage(value as "en" | "sw")

    // Show success toast
    toast({
      title: value === "en" ? "Language updated" : "Lugha imebadilishwa",
      description:
        value === "en"
          ? "Your language preference has been updated to English."
          : "Mapendeleo yako ya lugha yamebadilishwa kuwa Kiswahili.",
    })

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleNotificationToggle = (type: "email" | "sms" | "push", enabled: boolean) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [type]: enabled,
      },
    })

    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
      description: `${type.toUpperCase()} notifications have been ${enabled ? "enabled" : "disabled"}.`,
    })
  }

  const handleDarkModeToggle = (enabled: boolean) => {
    updatePreferences({
      darkMode: enabled,
    })

    toast({
      title: enabled ? "Dark mode enabled" : "Light mode enabled",
      description: `The application theme has been updated.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">{t("settings.profile")}</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">{t("settings.language")}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Moon className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Mobile App</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>{t("settings.profile")}</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full">
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Input id="avatar" name="avatar" type="file" accept="image/*" onChange={handleImageChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">{t("settings.name")}</Label>
                  <Input id="name" name="name" defaultValue={currentUser.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("settings.email")}</Label>
                  <Input id="email" name="email" type="email" defaultValue={currentUser.email} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("settings.phone")}</Label>
                  <Input id="phone" name="phone" defaultValue={currentUser.phone || ""} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
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
                      {t("settings.saving")}
                    </>
                  ) : (
                    t("settings.save")
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.language")}</CardTitle>
              <CardDescription>Change your preferred language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">{t("settings.language.select")}</Label>
                <Select defaultValue={currentUser.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder={t("settings.language.select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t("settings.language.en")}</SelectItem>
                    <SelectItem value="sw">{t("settings.language.sw")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive service reminders and updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) => handleNotificationToggle("email", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive service reminders and updates via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={preferences.notifications.sms}
                    onCheckedChange={(checked) => handleNotificationToggle("sms", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your mobile device</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={preferences.notifications.push}
                    onCheckedChange={(checked) => handleNotificationToggle("push", checked)}
                  />
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="flex items-start gap-4">
                  <Smartphone className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">Mobile App Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Download our mobile app to receive push notifications on your phone.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => document.getElementById("mobile-tab")?.click()}
                    >
                      Download App
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how Gari Langu looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
                  </div>
                  <Switch id="dark-mode" checked={preferences.darkMode} onCheckedChange={handleDarkModeToggle} />
                </div>

                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-start gap-4">
                    <Shield className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="text-sm font-medium">Data Saving Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Reduce data usage by loading lower quality images and disabling auto-play features.
                      </p>
                      <div className="flex items-center mt-2">
                        <Switch id="data-saving" />
                        <Label htmlFor="data-saving" className="ml-2">
                          Enable Data Saving
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" id="mobile-tab">
          <MobileAppDownload />
        </TabsContent>
      </Tabs>
    </div>
  )
}
