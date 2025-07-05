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
  const { user } = useAuthStore();
  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6 space-y-4">
        <div>
          <div className="font-semibold">Name</div>
          <div>{user?.email || "-"}</div>
        </div>
        <div>
          <div className="font-semibold">Email</div>
          <div>{user?.email || "-"}</div>
        </div>
        <div className="pt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" disabled>Change Password (Coming Soon)</button>
        </div>
        <div className="pt-2 text-sm text-muted-foreground">More settings coming soon...</div>
      </div>
    </div>
  );
}
