"use client"

import type React from "react"
import { Sidebar } from "@/components/admin-sidebar"
import { AdminMobileNav } from "@/components/admin-mobile-nav"
import { AdminBottomNav } from "@/components/admin-bottom-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Shield } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login-admin")
    }
  }, [isAuthenticated, isAdmin, router])

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-72">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:ml-72 w-full">
        {/* Header */}
        <header className="sticky top-0 z-30 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/95 backdrop-blur-xl dark:bg-slate-900/95 shadow-sm safe-top">
          <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
              <AdminMobileNav />
              <div className="flex items-center gap-2">
                <div className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Admin Panel
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400">Gari Langu</span>
            </div>
          </div>
        </header>

        {/* Page Content - Add padding bottom for mobile bottom nav */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <div className="container mx-auto p-3 md:p-6 lg:p-8">
            <div className="rounded-xl bg-white/60 backdrop-blur-sm dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <div className="p-4 md:p-6 lg:p-8 page-transition">
                {children}
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <AdminBottomNav />
      </div>
    </div>
  )
}
