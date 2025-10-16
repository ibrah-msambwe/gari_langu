"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Edit, Trash2, Eye } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function AdminPanel() {
  const { users, payments, updateUser, deleteUser, updatePaymentStatus } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("users")
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    phone: "",
    language: "en" as "en" | "sw",
  })

  // Get pending payments
  const pendingPayments = payments.filter((payment) => payment.status === "pending")

  const handleViewUser = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(userId)
      setEditUser({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        language: user.language,
      })
      setIsUserDialogOpen(true)
    }
  }

  const handleUpdateUser = () => {
    if (selectedUser === null) return

    updateUser(selectedUser, {
      name: editUser.name,
      email: editUser.email,
      phone: editUser.phone,
      language: editUser.language,
    })

    toast({
      title: "User updated",
      description: "User information has been updated successfully.",
    })

    setIsUserDialogOpen(false)
  }

  const handleDeleteUser = () => {
    if (selectedUser === null) return

    deleteUser(selectedUser)

    toast({
      title: "User deleted",
      description: "User has been deleted successfully.",
    })

    setIsDeleteDialogOpen(false)
  }

  const handleViewPayment = (paymentId: number) => {
    setSelectedPayment(paymentId)
    setAdminNotes("")
    setIsPaymentDialogOpen(true)
  }

  const handleApprovePayment = async () => {
    if (selectedPayment === null) return

    await updatePaymentStatus(selectedPayment, "verified", adminNotes)

    toast({
      title: "Payment approved",
      description: "The payment has been verified and the user's subscription has been extended.",
    })

    setIsPaymentDialogOpen(false)
  }

  const handleRejectPayment = async () => {
    if (selectedPayment === null) return

    await updatePaymentStatus(selectedPayment, "rejected", adminNotes)

    toast({
      title: "Payment rejected",
      description: "The payment has been rejected.",
    })

    setIsPaymentDialogOpen(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="payments">Pending Payments ({pendingPayments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.isAdmin ? (
                          <Badge className="bg-purple-500">Admin</Badge>
                        ) : user.isSubscribed &&
                          user.subscriptionEndDate &&
                          new Date(user.subscriptionEndDate) > new Date() ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : user.pendingPayment ? (
                          <Badge className="bg-yellow-500">Pending</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewUser(user.id)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          {!user.isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => {
                                setSelectedUser(user.id)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button onClick={() => router.push("/admin/users")}>View Full User Management</Button>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            {pendingPayments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending payments to verify.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((payment) => {
                      const user = users.find((u) => u.id === payment.userId)
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>{user?.name || "Unknown User"}</TableCell>
                          <TableCell>{payment.amount} TZS</TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewPayment(payment.id)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="mt-4">
              <Button onClick={() => router.push("/admin/payments")}>View All Payments</Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* User Edit Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={editUser.phone}
                  onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-language">Language</Label>
                <select
                  id="edit-language"
                  value={editUser.language}
                  onChange={(e) => setEditUser({ ...editUser, language: e.target.value as "en" | "sw" })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Verification Dialog */}
        {selectedPayment !== null && (
          <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Payment Verification</DialogTitle>
                <DialogDescription>Review payment details and verify or reject the payment.</DialogDescription>
              </DialogHeader>

              {(() => {
                const payment = payments.find((p) => p.id === selectedPayment)
                if (!payment) return null

                const user = users.find((u) => u.id === payment.userId)

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Payment Information</h3>
                        <div className="mt-2 space-y-1 text-sm">
                          <p>
                            <strong>Amount:</strong> {payment.amount} TZS
                          </p>
                          <p>
                            <strong>Method:</strong> {payment.method}
                          </p>
                          <p>
                            <strong>Date:</strong> {new Date(payment.date).toLocaleString()}
                          </p>
                          <p>
                            <strong>Duration:</strong> {payment.months} month{payment.months > 1 ? "s" : ""}
                          </p>
                          {payment.transactionId && (
                            <p>
                              <strong>Transaction ID:</strong> {payment.transactionId}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium">User Information</h3>
                        <div className="mt-2 space-y-1 text-sm">
                          {user ? (
                            <>
                              <p>
                                <strong>Name:</strong> {user.name}
                              </p>
                              <p>
                                <strong>Email:</strong> {user.email}
                              </p>
                              <p>
                                <strong>Phone:</strong> {user.phone || "Not provided"}
                              </p>
                            </>
                          ) : (
                            <p>User not found</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {payment.verificationMessage && (
                      <div>
                        <h3 className="text-sm font-medium">Verification Message</h3>
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                          {payment.verificationMessage}
                        </div>
                      </div>
                    )}

                    {payment.verificationImage && (
                      <div>
                        <h3 className="text-sm font-medium">Verification Image</h3>
                        <div className="mt-2 border rounded-md p-2">
                          <img
                            src={payment.verificationImage || "/placeholder.svg"}
                            alt="Payment Verification"
                            className="max-h-[300px] mx-auto object-contain"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium">Admin Notes</h3>
                      <Textarea
                        className="mt-2"
                        placeholder="Add notes about this payment verification"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                      />
                    </div>
                  </div>
                )
              })()}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleRejectPayment}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Payment
                </Button>
                <Button onClick={handleApprovePayment}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete User Confirmation */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user account and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteUser}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
