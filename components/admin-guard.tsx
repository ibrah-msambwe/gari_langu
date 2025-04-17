"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      router.push("/admin-login")
    }
  }, [isAuthenticated, isAdmin, router])

  return <>{children}</>
}
