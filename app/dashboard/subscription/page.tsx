"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth-store"
import { SubscriptionManager } from "@/components/subscription-manager"
import { ArrowLeft } from "lucide-react"
import { PaymentExampleHelper } from "@/components/payment-example-helper"

export default function SubscriptionPage() {
  const router = useRouter()
  const { isAuthenticated, canAccessApp } = useAuthStore()
  const [showExamples, setShowExamples] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {canAccessApp() && (
            <Button variant="outline" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
            <p className="text-muted-foreground">Manage your Gari Langu subscription</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowExamples(!showExamples)}>
          {showExamples ? "Hide Examples" : "Show Examples"}
        </Button>
      </div>

      <div className="grid gap-6">
        {!canAccessApp() && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Subscription Required</h3>
                <div className="mt-2 text-sm">
                  <p>Your free trial has expired. Please subscribe to continue using Gari Langu.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <SubscriptionManager />
          </div>

          {showExamples && (
            <div className="md:col-span-1">
              <PaymentExampleHelper />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
