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
    if (!isAuthenticated || !isAdmin()) {
      router.push("/admin-login")
    }
  }, [isAuthenticated, isAdmin, router])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
