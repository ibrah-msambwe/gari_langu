"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth-store"
import { Users, CreditCard, Bell, Settings, LayoutDashboard, Home, LogOut, Car, Plus } from "lucide-react"
import { useGlobalLoading } from "@/components/ui/toaster"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const authStore = useAuthStore()
  const setLoading = useGlobalLoading((s) => s.setLoading)

  const handleLogout = async () => {
    await authStore.logout()
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
    <div className="hidden w-72 flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border-r border-slate-200/50 dark:border-slate-700/50 shadow-xl md:flex">
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b border-slate-200/50 dark:border-slate-700/50 px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gari Langu</p>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <div className="flex-1 overflow-auto py-6">
        <nav className="space-y-2 px-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-md",
                pathname === item.href
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              )}
              onClick={() => setLoading(true)}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                pathname === item.href
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              )}>
                {item.icon}
              </div>
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>
        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                <Plus className="h-4 w-4" />
              </div>
              <span className="font-medium">Add User</span>
            </Link>
            <Link
              href="/admin/payments"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="font-medium">Verify Payment</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-auto p-6 border-t border-slate-200/50 dark:border-slate-700/50">
        <Button variant="outline" className="w-full mb-2" onClick={() => router.push("/")}> 
          <Home className="h-4 w-4 mr-2" />
          Return to App
        </Button>
        <Button variant="ghost" className="w-full text-red-500" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
