"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Search, Filter, CheckCircle, XCircle, Eye, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<PaymentStatus | "all">("all")
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMethod, setFilterMethod] = useState<string>("all")

  useEffect(() => {
    const fetchPaymentsAndUsers = async () => {
      const { data: paymentsData, error: paymentsError } = await supabase.from("payments").select("*")
      const { data: usersData, error: usersError } = await supabase.from("users").select("*")
      if (!paymentsError && paymentsData) setPayments(paymentsData)
      if (!usersError && usersData) setUsers(usersData)
    }
    fetchPaymentsAndUsers()
  }, [])

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    // Filter by status
    if (activeTab !== "all" && payment.status !== activeTab) return false

    // Filter by payment method
    if (filterMethod !== "all" && payment.method !== filterMethod) return false

    // Filter by search query
    if (searchQuery) {
      const user = users.find((u) => u.id === payment.userId)
      const userName = user ? user.name.toLowerCase() : ""
      const userEmail = user ? user.email.toLowerCase() : ""
      const searchLower = searchQuery.toLowerCase()

      // Search by transaction ID, amount, user name, or email
      return (
        (payment.transactionId && payment.transactionId.toLowerCase().includes(searchLower)) ||
        payment.amount.toString().includes(searchLower) ||
        userName.includes(searchLower) ||
        userEmail.includes(searchLower)
      )
    }

    return true
  })

  const handleViewPayment = (paymentId: number) => {
    const payment = payments.find((p) => p.id === paymentId)
    if (!payment) return

    setSelectedPayment(paymentId)
    setAdminNotes(payment.adminNotes || "")
    setIsDialogOpen(true)
  }

  const handleApprovePayment = async () => {
    if (selectedPayment === null) return
    // Update payment status in Supabase
    await supabase.from("payments").update({ status: "verified", adminNotes }).eq("id", selectedPayment)
    setPayments(payments.map((p) => p.id === selectedPayment ? { ...p, status: "verified", adminNotes } : p))
    toast({
      title: "Payment approved",
      description: "The payment has been verified and the user's subscription has been extended.",
    })
    setIsDialogOpen(false)
  }

  const handleRejectPayment = async () => {
    if (selectedPayment === null) return
    // Update payment status in Supabase
    await supabase.from("payments").update({ status: "rejected", adminNotes }).eq("id", selectedPayment)
    setPayments(payments.map((p) => p.id === selectedPayment ? { ...p, status: "rejected", adminNotes } : p))
    toast({
      title: "Payment rejected",
      description: "The payment has been rejected.",
    })
    setIsDialogOpen(false)
  }

  // Get unique payment methods
  const paymentMethods = Array.from(new Set(payments.map((p) => p.method)))

  // Get selected payment details
  const selectedPaymentDetails = selectedPayment !== null ? payments.find((p) => p.id === selectedPayment) : null

  const selectedPaymentUser = selectedPaymentDetails ? users.find((u) => u.id === selectedPaymentDetails.userId) : null

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Payment Management</h1>
        <p className="text-sm md:text-base text-muted-foreground">Verify and manage user payments</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            className="pl-8 w-full sm:w-[300px] min-h-[44px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={filterMethod} onValueChange={setFilterMethod}>
            <SelectTrigger className="w-full sm:w-[180px] min-h-[44px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              {paymentMethods.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="elevation-2">
        <CardHeader className="pb-3 p-4 md:p-6">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as PaymentStatus | "all")}
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all" className="min-h-[40px]">All</TabsTrigger>
              <TabsTrigger value="pending" className="min-h-[40px]">Pending</TabsTrigger>
              <TabsTrigger value="verified" className="min-h-[40px]">Verified</TabsTrigger>
              <TabsTrigger value="rejected" className="min-h-[40px]">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3 p-4">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No payments found matching your filters
              </div>
            ) : (
              filteredPayments.map((payment) => {
                const user = users.find((u) => u.id === payment.userId)
                return (
                  <Card key={payment.id} className="elevation-1">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-semibold text-base">{user?.name || "Unknown User"}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-sm font-medium">{payment.amount.toLocaleString()} TZS</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{payment.method}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                        {payment.status === "pending" && <Badge className="bg-yellow-500">Pending</Badge>}
                        {payment.status === "verified" && <Badge className="bg-green-500">Verified</Badge>}
                        {payment.status === "rejected" && (
                          <Badge variant="outline" className="border-red-200 text-red-700">
                            Rejected
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full min-h-[44px] touch-feedback"
                        onClick={() => handleViewPayment(payment.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No payments found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => {
                  const user = users.find((u) => u.id === payment.userId)
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user?.name || "Unknown User"}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.amount.toLocaleString()} TZS</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.months} month{payment.months > 1 ? "s" : ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        {payment.status === "pending" && <Badge className="bg-yellow-500">Pending</Badge>}
                        {payment.status === "verified" && <Badge className="bg-green-500">Verified</Badge>}
                        {payment.status === "rejected" && (
                          <Badge variant="outline" className="border-red-200 text-red-700">
                            Rejected
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewPayment(payment.id)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Review payment information and verification details.</DialogDescription>
          </DialogHeader>

          {selectedPaymentDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p>{selectedPaymentUser?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p>{selectedPaymentDetails.amount.toLocaleString()} TZS</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{new Date(selectedPaymentDetails.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Method</p>
                  <p>{selectedPaymentDetails.method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                  <p>{selectedPaymentDetails.transactionId || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p>
                    {selectedPaymentDetails.status === "pending" && <Badge className="bg-yellow-500">Pending</Badge>}
                    {selectedPaymentDetails.status === "verified" && <Badge className="bg-green-500">Verified</Badge>}
                    {selectedPaymentDetails.status === "rejected" && (
                      <Badge variant="outline" className="border-red-200 text-red-700">
                        Rejected
                      </Badge>
                    )}
                  </p>
                </div>
              </div>

              {selectedPaymentDetails.verificationMessage && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verification Message</p>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {selectedPaymentDetails.verificationMessage}
                  </div>
                </div>
              )}

              {selectedPaymentDetails.verificationImage && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verification Image</p>
                  <div className="mt-1">
                    <img
                      src={selectedPaymentDetails.verificationImage || "/placeholder.svg"}
                      alt="Payment verification"
                      className="max-h-40 rounded-md border"
                    />
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <a
                        href={selectedPaymentDetails.verificationImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-notes">Admin Notes</Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Add notes about this payment..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
            {selectedPaymentDetails?.status === "pending" ? (
              <>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto min-h-[44px] touch-feedback" 
                  onClick={() => handleRejectPayment()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  className="w-full sm:w-auto min-h-[44px] touch-feedback" 
                  onClick={() => handleApprovePayment()}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            ) : (
              <Button 
                className="w-full min-h-[44px] touch-feedback" 
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
