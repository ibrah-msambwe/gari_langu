"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { useAuthStore } from "@/lib/auth-store"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, canAccessApp } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (!canAccessApp() && router.pathname !== "/dashboard/subscription") {
      router.push("/dashboard/subscription")
    }
  }, [isAuthenticated, canAccessApp, router])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MobileNav />
            <h1 className="text-xl font-bold">Gari Langu</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
      </div>
    </div>
  )
}
