"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, Bell, BarChart, Loader2 } from "lucide-react"
import { AdminNotifications } from "@/components/admin-notifications"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { useNotificationStore } from "@/lib/notification-store"
import { useAuthStore, type Payment } from "@/lib/auth-store"

function VerifyPaymentModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { payments = [], updatePaymentStatus } = useAuthStore();
  const { toast } = useToast();
  const [selected, setSelected] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const pendingPayments = payments.filter((p: Payment) => p.status === "pending");
  const selectedPayment = selected !== null ? payments.find((p: Payment) => p.id === selected) : null;

  const handleApprove = async () => {
    if (!selectedPayment) return;
    await updatePaymentStatus(selectedPayment.id, "verified", adminNotes);
    toast({ title: "Payment approved", description: "Payment has been verified." });
    setSelected(null);
    setAdminNotes("");
    onOpenChange(false);
  };
  const handleReject = async () => {
    if (!selectedPayment) return;
    await updatePaymentStatus(selectedPayment.id, "rejected", adminNotes);
    toast({ title: "Payment rejected", description: "Payment has been rejected." });
    setSelected(null);
    setAdminNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Verify Payment</DialogTitle>
        </DialogHeader>
        {pendingPayments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No pending payments.</div>
        ) : selectedPayment ? (
          <div className="space-y-4">
            <div>
              <div className="font-medium">User: (user info not available)</div>
              <div>Amount: <span className="font-semibold">{selectedPayment.amount?.toLocaleString?.() ?? selectedPayment.amount} TZS</span></div>
              <div>Method: {selectedPayment.method}</div>
              <div>Date: {new Date(selectedPayment.date).toLocaleDateString()}</div>
              <div>Months: {selectedPayment.months}</div>
            </div>
            <div>
              <Label htmlFor="adminNotes">Admin Notes</Label>
              <Input id="adminNotes" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} />
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="destructive" onClick={handleReject}>Reject</Button>
              <Button onClick={handleApprove}>Approve</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingPayments.map((p: Payment) => (
              <div key={p.id} className="flex items-center justify-between border rounded-lg p-3 mb-2">
                <div>
                  <div className="font-medium">(user info not available)</div>
                  <div className="text-xs text-muted-foreground">(user email not available)</div>
                  <div className="text-xs">{p.amount?.toLocaleString?.() ?? p.amount} TZS • {p.method}</div>
                </div>
                <Button size="sm" onClick={() => setSelected(p.id)}>Review</Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDashboard() {
  // Only use payments and updateUser
  const { payments = [], updateUser } = useAuthStore();
  const { toast } = useToast();
  const [verifyPaymentOpen, setVerifyPaymentOpen] = useState(false);
  const [verifyPaymentLoading, setVerifyPaymentLoading] = useState(false);

  // Count pending payments
  const pendingPayments = payments.filter((payment: Payment) => payment.status === "pending").length;

  // Calculate total revenue
  const totalRevenue = payments
    .filter((payment: Payment) => payment.status === "verified")
    .reduce((sum: number, payment: Payment) => sum + (typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount || '0')), 0);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="mb-4 md:mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">Admin Dashboard</h1>
          <p className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300">Overview of your system</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="w-full sm:w-auto min-h-[44px] bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md elevation-2 hover:elevation-3 touch-feedback ripple"
            onClick={() => {
              setVerifyPaymentLoading(true)
              setVerifyPaymentOpen(true)
            }}
            disabled={verifyPaymentLoading}
          >
            {verifyPaymentLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verify Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-teal-100 dark:from-slate-800 dark:to-slate-900 card-appear elevation-2 hover:elevation-3 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-900 dark:text-green-200">Total Revenue</CardTitle>
            <BarChart className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-green-900 dark:text-green-200">{totalRevenue.toLocaleString()} TZS</div>
            <p className="text-xs text-green-700 dark:text-green-300">
              From {payments.filter((p) => p.status === "verified").length} verified payments
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-pink-100 dark:from-slate-800 dark:to-slate-900 card-appear elevation-2 hover:elevation-3 transition-all duration-300" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-900 dark:text-orange-200">Pending Payments</CardTitle>
            <CreditCard className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-orange-900 dark:text-orange-200">{pendingPayments}</div>
            <p className="text-xs text-orange-700 dark:text-orange-300">Awaiting verification</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Verification Modal */}
      <VerifyPaymentModal open={verifyPaymentOpen} onOpenChange={setVerifyPaymentOpen} />
    </div>
  );
}
