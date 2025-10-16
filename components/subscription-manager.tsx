"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuthStore } from "@/lib/auth-store"
import { CreditCard, Loader2, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type React from "react"

export function SubscriptionManager() {
  const { toast } = useToast()
  const { currentUser, updateCurrentUser, addPayment, payments, getPaymentsByUserId } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [months, setMonths] = useState(1)
  const [transactionId, setTransactionId] = useState("")
  const [verificationMessage, setVerificationMessage] = useState("")
  const [verificationImage, setVerificationImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("subscribe")
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!currentUser) {
    return null
  }

  const userPayments = getPaymentsByUserId(currentUser.id)
  const pendingPayment = userPayments.find((p) => p.status === "pending")

  const isSubscribed =
    currentUser.isSubscribed && currentUser.subscriptionEndDate
      ? new Date(currentUser.subscriptionEndDate) > new Date()
      : false

  const subscriptionEndDate = currentUser.subscriptionEndDate
    ? new Date(currentUser.subscriptionEndDate).toLocaleDateString()
    : "No active subscription"

  const trialEndDate = new Date(currentUser.trialEndDate).toLocaleDateString()
  const isTrialActive = new Date() <= new Date(currentUser.trialEndDate)

  const calculateAmount = (months: number) => {
    const monthlyRate = 10000 // 10,000 TZS per month
    return months * monthlyRate
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setVerificationImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!transactionId) {
      toast({
        title: "Transaction ID required",
        description: "Please enter the transaction ID from your payment",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (!verificationMessage) {
      toast({
        title: "Verification message required",
        description: "Please paste the payment confirmation message",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Add payment record
    try {
      await addPayment({
        userId: currentUser.id,
        amount: calculateAmount(months),
        method: paymentMethod,
        months,
        transactionId,
        verificationMessage,
        verificationImage: verificationImage || undefined,
      })

      toast({
        title: "Payment submitted",
        description: "Your payment verification has been submitted and is pending approval.",
      })

      // Reset form
      setTransactionId("")
      setVerificationMessage("")
      setVerificationImage(null)
      setActiveTab("history")

      // Simulate delay for better UX
      setTimeout(() => {
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      toast({
        title: "Error submitting payment",
        description: "An error occurred while submitting your payment. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "verified":
        return <Badge className="bg-green-500">Verified</Badge>
      case "rejected":
        return (
          <Badge variant="outline" className="border-red-200 text-red-700">
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>Manage your Gari Langu subscription</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="subscribe" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Subscription Status</h3>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium">
                    {isSubscribed ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : isTrialActive ? (
                      <Badge className="bg-blue-500">Trial</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </span>
                </div>
                {isSubscribed && (
                  <div className="flex justify-between">
                    <span>Expires on:</span>
                    <span className="font-medium">{subscriptionEndDate}</span>
                  </div>
                )}
                {isTrialActive && !isSubscribed && (
                  <div className="flex justify-between">
                    <span>Trial ends on:</span>
                    <span className="font-medium">{trialEndDate}</span>
                  </div>
                )}
              </div>
            </div>

            {pendingPayment ? (
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
                    <h3 className="text-sm font-medium">Payment Pending</h3>
                    <div className="mt-2 text-sm">
                      <p>
                        Your payment of {pendingPayment.amount.toLocaleString()} TZS is pending verification. We'll
                        notify you once it's approved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Payment Information</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subscription-duration">Subscription Duration</Label>
                      <RadioGroup
                        id="subscription-duration"
                        defaultValue="1"
                        value={months.toString()}
                        onValueChange={(value) => setMonths(Number.parseInt(value))}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="r1" />
                          <Label htmlFor="r1" className="flex justify-between w-full">
                            <span>1 Month</span>
                            <span>{calculateAmount(1).toLocaleString()} TZS</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3" id="r2" />
                          <Label htmlFor="r2" className="flex justify-between w-full">
                            <span>3 Months</span>
                            <span>{calculateAmount(3).toLocaleString()} TZS</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="6" id="r3" />
                          <Label htmlFor="r3" className="flex justify-between w-full">
                            <span>6 Months</span>
                            <span>{calculateAmount(6).toLocaleString()} TZS</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="12" id="r4" />
                          <Label htmlFor="r4" className="flex justify-between w-full">
                            <span>12 Months</span>
                            <span>{calculateAmount(12).toLocaleString()} TZS</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <RadioGroup
                        id="payment-method"
                        defaultValue="mpesa"
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mpesa" id="m1" />
                          <Label htmlFor="m1">M-Pesa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tigopesa" id="m2" />
                          <Label htmlFor="m2">Tigo Pesa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="airtelmoney" id="m3" />
                          <Label htmlFor="m3">Airtel Money</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium">Payment Instructions</h3>
                          <div className="mt-2 text-sm">
                            <p>Please send {calculateAmount(months).toLocaleString()} TZS to the following number:</p>
                            <p className="mt-1 font-medium">+255 712 815 726 (Ibrahim Msambwe)</p>
                            <p className="mt-2 text-xs">
                              After making the payment, enter the transaction ID and paste the confirmation message
                              below.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transaction-id">Transaction ID</Label>
                      <Input
                        id="transaction-id"
                        placeholder="e.g. MPESA12345678"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verification-message">Payment Confirmation Message</Label>
                      <Textarea
                        id="verification-message"
                        placeholder="Paste the payment confirmation message here..."
                        value={verificationMessage}
                        onChange={(e) => setVerificationMessage(e.target.value)}
                        required
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verification-image">Upload Screenshot (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {verificationImage ? "Change Image" : "Upload Image"}
                        </Button>
                        {verificationImage && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setVerificationImage(null)}
                            className="text-red-500"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="verification-image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {verificationImage && (
                        <div className="mt-2">
                          <img
                            src={verificationImage || "/placeholder.svg"}
                            alt="Payment verification"
                            className="max-h-40 rounded-md border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>Submit Payment Verification</>
                  )}
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment History</h3>
              {userPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No payment history found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPayments.map((payment) => (
                    <div key={payment.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{payment.amount.toLocaleString()} TZS</span>
                            {getStatusBadge(payment.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {payment.method} • {new Date(payment.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-1">
                            {payment.months} month{payment.months > 1 ? "s" : ""} subscription
                          </p>
                          {payment.adminNotes && (
                            <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                              <p className="font-medium">Admin Notes:</p>
                              <p>{payment.adminNotes}</p>
                            </div>
                          )}
                        </div>
                        {payment.status === "pending" && (
                          <div className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin text-yellow-500 mr-1" />
                            <span className="text-xs text-muted-foreground">Awaiting verification</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
