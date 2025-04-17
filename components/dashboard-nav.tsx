"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Bell, Car, CreditCard, History, Settings } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function DashboardNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    {
      title: t("dashboard.overview"),
      href: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      exact: true, // Only match exact path
    },
    {
      title: t("dashboard.cars"),
      href: "/dashboard/cars",
      icon: <Car className="h-5 w-5" />,
      exact: false, // Match any path that starts with this
    },
    {
      title: t("dashboard.reminders"),
      href: "/dashboard/reminders",
      icon: <Bell className="h-5 w-5" />,
      exact: false,
    },
    {
      title: t("services.title"),
      href: "/dashboard/history",
      icon: <History className="h-5 w-5" />,
      exact: true,
    },
    {
      title: "Subscription",
      href: "/dashboard/subscription",
      icon: <CreditCard className="h-5 w-5" />,
      exact: true,
    },
    {
      title: t("dashboard.settings"),
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      exact: false,
    },
  ]

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname === item.href || pathname.startsWith(item.href + "/")
  }

  return (
    <nav className="grid items-start px-2 text-sm font-medium">
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
            isActive(item) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
