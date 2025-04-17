"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth-store"
import { Users, CreditCard, Bell, Settings, LayoutDashboard, Home, LogOut } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const authStore = useAuthStore()

  const handleLogout = () => {
    authStore.logout() // Use logout instead of logoutUser
    router.push("/")
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      title: "Payments",
      href: "/admin/payments",
      icon: <CreditCard className="h-5 w-5 mr-2" />,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: <Bell className="h-5 w-5 mr-2" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5 mr-2" />,
    },
  ]

  return (
    <div className="hidden w-64 flex-col bg-white dark:bg-gray-800 border-r md:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center font-semibold">
          <LayoutDashboard className="h-5 w-5 mr-2 text-primary" />
          <span>Admin Dashboard</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
          <Home className="h-4 w-4 mr-2" />
          Return to App
        </Button>
        <Button variant="ghost" className="w-full mt-2 text-red-500" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
