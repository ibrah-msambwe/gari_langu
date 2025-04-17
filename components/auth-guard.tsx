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
  const { isAuthenticated, canAccessApp, currentUser, isAdmin } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false)
  const [showPendingAlert, setShowPendingAlert] = useState(false)

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/admin-login"]

  // Routes that are always accessible even with expired subscription
  const alwaysAccessibleRoutes = [...publicRoutes, "/dashboard/subscription"]

  // Admin routes
  const adminRoutes = ["/admin", "/admin/payments", "/admin/users", "/admin/settings", "/admin/notifications"]

  useEffect(() => {
    // Handle routing based on authentication and subscription status
    const handleRouting = async () => {
      setIsLoading(true)

      // Check if trying to access admin routes
      const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

      if (isAdminRoute) {
        // Check if user is an admin
        if (!isAuthenticated || !isAdmin()) {
          // Redirect to admin login if not authenticated or not an admin
          router.push("/admin-login")
          return
        }

        // Admin can access admin routes
        setIsLoading(false)
        return
      }

      if (!isAuthenticated && !publicRoutes.includes(pathname)) {
        // Redirect to login if not authenticated
        router.push("/login")
      } else if (isAuthenticated && !canAccessApp() && !alwaysAccessibleRoutes.includes(pathname)) {
        // Check if user has a pending payment
        if (currentUser?.pendingPayment) {
          // Show pending payment alert for 3 seconds before redirecting
          setShowPendingAlert(true)
          await new Promise((resolve) => setTimeout(resolve, 3000))
          setShowPendingAlert(false)

          // Redirect to subscription page
          router.push("/dashboard/subscription")
        } else {
          // Show subscription alert for 3 seconds before redirecting
          setShowSubscriptionAlert(true)
          await new Promise((resolve) => setTimeout(resolve, 3000))
          setShowSubscriptionAlert(false)

          // Redirect to subscription page if trial expired and not subscribed
          router.push("/dashboard/subscription")
        }
      } else {
        setIsLoading(false)
      }
    }

    handleRouting()
  }, [isAuthenticated, canAccessApp, pathname, router, currentUser, isAdmin])

  // If on a protected route and not authenticated, show loading
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

  // If authenticated but trial expired and not subscribed, and not on allowed pages
  if (showSubscriptionAlert) {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Subscription Required</AlertTitle>
            <AlertDescription>
              Your {currentUser?.isSubscribed ? "subscription" : "trial"} has expired. You need an active subscription
              to access this feature.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">Redirecting to subscription page...</p>
        </div>
      </div>
    )
  }

  // If authenticated but payment is pending verification
  if (showPendingAlert) {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Pending Verification</AlertTitle>
            <AlertDescription>
              Your payment is being verified by our team. You will be notified once it's approved.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">Redirecting to subscription page...</p>
        </div>
      </div>
    )
  }

  // If still loading
  if (isLoading && isAuthenticated && !canAccessApp() && !alwaysAccessibleRoutes.includes(pathname)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking subscription status...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
