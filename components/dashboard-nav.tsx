"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Bell, Car, CreditCard, History, Settings, Plus, Calendar } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useGlobalLoading } from "@/components/ui/toaster"

export function DashboardNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const setLoading = useGlobalLoading((s) => s.setLoading)

  const navItems = [
    {
      title: t("dashboard.overview"),
      href: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      exact: true,
      description: "Overview and analytics"
    },
    {
      title: t("dashboard.cars"),
      href: "/dashboard/cars",
      icon: <Car className="h-5 w-5" />,
      exact: false,
      description: "Manage your vehicles"
    },
    {
      title: t("dashboard.reminders"),
      href: "/dashboard/reminders",
      icon: <Bell className="h-5 w-5" />,
      exact: false,
      description: "Service reminders"
    },
    {
      title: t("services.title"),
      href: "/dashboard/history",
      icon: <History className="h-5 w-5" />,
      exact: true,
      description: "Service history"
    },
    {
      title: "Subscription",
      href: "/dashboard/subscription",
      icon: <CreditCard className="h-5 w-5" />,
      exact: true,
      description: "Manage subscription"
    },
    {
      title: t("dashboard.settings"),
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      exact: false,
      description: "Account settings"
    },
  ]

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname === item.href || pathname.startsWith(item.href + "/")
  }

  return (
    <nav className="space-y-2 px-4">
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Navigation
        </h3>
      </div>
      
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-md",
            isActive(item) 
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" 
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
          )}
          onClick={() => setLoading(true)}
        >
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
            isActive(item)
              ? "bg-white/20 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          )}>
            {item.icon}
          </div>
          <div className="flex-1">
            <div className="font-medium">{item.title}</div>
            <div className={cn(
              "text-xs transition-colors",
              isActive(item)
                ? "text-white/80"
                : "text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
            )}>
              {item.description}
            </div>
          </div>
        </Link>
      ))}

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Link
            href="/dashboard/cars/add"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              <Plus className="h-4 w-4" />
            </div>
            <span className="font-medium">Add New Car</span>
          </Link>
          <Link
            href="/dashboard/reminders/add"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="font-medium">Schedule Reminder</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
