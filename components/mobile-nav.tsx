"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { BarChart3, Bell, Car, CreditCard, History, Menu, Settings, X, User, LogOut } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useAuthStore } from "@/lib/auth-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useGlobalLoading } from "@/components/ui/toaster"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const { isAuthenticated, currentUser, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const setLoading = useGlobalLoading((s) => s.setLoading)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only show mobile nav for authenticated users
  if (!mounted) return null

  const navItems = [
    {
      title: t("dashboard.overview"),
      href: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: t("dashboard.cars"),
      href: "/dashboard/cars",
      icon: <Car className="h-5 w-5" />,
    },
    {
      title: t("dashboard.reminders"),
      href: "/dashboard/reminders",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: t("services.title"),
      href: "/dashboard/history",
      icon: <History className="h-5 w-5" />,
    },
    {
      title: "Subscription",
      href: "/dashboard/subscription",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: t("dashboard.settings"),
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleLogout = () => {
    setOpen(false)
    logout()
    router.push("/")
  }

  if (!isAuthenticated) {
    return (
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.push("/login")}>
        <User className="h-5 w-5" />
        <span className="sr-only">Login</span>
      </Button>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden touch-feedback">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 safe-left">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Gari Langu</h2>
            </div>
            <Button variant="ghost" size="icon" className="touch-feedback" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* User profile section */}
          {currentUser && (
            <div className="border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/dashboard/settings" onClick={() => { setOpen(false); setLoading(true); }} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full min-h-[44px] touch-feedback">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Link href="/dashboard/subscription" onClick={() => { setOpen(false); setLoading(true); }} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full min-h-[44px] touch-feedback">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscribe
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-auto py-4">
            <div className="grid gap-2 px-4">
              {navItems.map((item, index) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => { setOpen(false); setLoading(true); }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 touch-feedback min-h-[48px]",
                      active
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg elevation-2"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    )}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="border-t p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 min-h-[48px] touch-feedback" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Log out
            </Button>
            <Separator className="my-4" />
            <p className="text-xs text-center text-muted-foreground">&copy; {new Date().getFullYear()} Gari Langu. All rights reserved.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
