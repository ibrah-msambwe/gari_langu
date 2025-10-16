"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Bell, Car, CreditCard, History, Settings } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useGlobalLoading } from "@/components/ui/toaster"
import { useAuthStore } from "@/lib/auth-store"

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const { isAuthenticated } = useAuthStore()
  const setLoading = useGlobalLoading((s) => s.setLoading)

  // Only show on mobile for authenticated dashboard users
  if (!isAuthenticated || !pathname.startsWith("/dashboard")) {
    return null
  }

  const navItems = [
    {
      title: t("dashboard.overview"),
      href: "/dashboard",
      icon: BarChart3,
      exact: true,
    },
    {
      title: t("dashboard.cars"),
      href: "/dashboard/cars",
      icon: Car,
      exact: false,
    },
    {
      title: t("dashboard.reminders"),
      href: "/dashboard/reminders",
      icon: Bell,
      exact: false,
    },
    {
      title: t("services.title"),
      href: "/dashboard/history",
      icon: History,
      exact: true,
    },
    {
      title: t("dashboard.settings"),
      href: "/dashboard/settings",
      icon: Settings,
      exact: false,
    },
  ]

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname === item.href || pathname.startsWith(item.href + "/")
  }

  const handleNavigation = (href: string) => {
    setLoading(true)
    router.push(href)
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl safe-bottom">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item)
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 rounded-lg mx-0.5 touch-feedback no-select min-h-[48px]",
                active
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300",
                  active
                    ? "bg-blue-100 dark:bg-blue-900/30 scale-110 elevation-1"
                    : "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    active ? "stroke-[2.5]" : "stroke-[2]"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-all no-select",
                  active ? "font-semibold" : ""
                )}
              >
                {item.title.split(" ")[0]}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

