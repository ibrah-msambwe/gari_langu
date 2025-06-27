"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { useAuthStore } from "@/lib/auth-store"
import { MobileNav } from "@/components/mobile-nav"
import { Car } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, canAccessApp } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (!canAccessApp() && pathname !== "/dashboard/subscription") {
      router.push("/dashboard/subscription")
    }
  }, [isAuthenticated, canAccessApp, router, pathname])

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0">
        <div className="flex h-full flex-col bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 border-r border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          {/* Logo Section */}
          <div className="flex h-16 items-center border-b border-slate-200/50 dark:border-slate-700/50 px-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Gari Langu
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Car Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6">
            <DashboardNav />
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-4">
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-3">
              <p className="text-xs text-slate-600 dark:text-slate-300 text-center">
                © 2024 Gari Langu
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <MobileNav />
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Dashboard
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="rounded-xl bg-white/60 backdrop-blur-sm dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <div className="p-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
