"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const { t } = useLanguage()

  const routes = [
    {
      href: "/dashboard",
      label: t("dashboard.overview"),
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/cars",
      label: t("dashboard.cars"),
      active: pathname.startsWith("/dashboard/cars"),
    },
    {
      href: "/dashboard/reminders",
      label: t("dashboard.reminders"),
      active: pathname === "/dashboard/reminders",
    },
    {
      href: "/dashboard/settings",
      label: t("dashboard.settings"),
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
