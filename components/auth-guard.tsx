"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  // Debug logs
  console.log("[AuthGuard] isAuthenticated:", isAuthenticated, "isAdmin:", isAdmin, "pathname:", pathname)

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/login-admin"]

  // Admin routes
  const adminRoutes = ["/admin", "/admin/payments", "/admin/users", "/admin/settings", "/admin/notifications"]

  useEffect(() => {
    setIsLoading(true)
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
    if (isAdminRoute) {
      if (!isAuthenticated || !isAdmin) {
        router.push("/admin-login")
        return
      }
      setIsLoading(false)
      return
    }
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, pathname, router, isAdmin])

  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If stuck loading but you are admin, show a message and allow access
  if (isLoading && isAuthenticated && isAdmin && pathname.startsWith("/admin")) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg text-green-600">You are authenticated as admin. If you see this, the admin page is not rendering properly.</p>
          <p className="text-sm text-muted-foreground">Check your /admin page for errors related to missing users array or other data.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>
}
