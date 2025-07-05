"use client"

import type React from "react"
import { Sidebar } from "@/components/admin-sidebar"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/admin-login")
    }
  }, [isAuthenticated, isAdmin, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="fixed left-0 top-0 z-40 h-screen w-72">
        <Sidebar />
      </div>
      <div className="ml-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 shadow-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Admin Panel</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Gari Langu</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-8">
            <div className="rounded-xl bg-white/60 backdrop-blur-sm dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <div className="p-8">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
