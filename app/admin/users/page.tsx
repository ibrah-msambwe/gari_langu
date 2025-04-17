"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Search, Filter, RefreshCw, Power, PowerOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminUsersPage() {
  const { users, updateUser, deleteUser, setUserActive } = useAuthStore()
  const { toast } = useToast()
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "pending" | "admin" | "disabled">(
    "all",
  )
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    phone: "",
    language: "en" as "en" | "sw",
  })

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery))

    // Apply status filter
    let matchesStatus = true
    if (filterStatus === "active") {
      matchesStatus =
        user.isSubscribed &&
        user.subscriptionEndDate &&
        new Date(user.subscriptionEndDate) > new Date() &&
        user.isActive === true
    } else if (filterStatus === "inactive") {
      matchesStatus =
        (!user.isSubscribed || !user.subscriptionEndDate || new Date(user.subscriptionEndDate) <= new Date()) &&
        user.isActive === true
    } else if (filterStatus === "pending") {
      matchesStatus = !!user.pendingPayment && user.isActive === true
    } else if (filterStatus === "admin") {
      matchesStatus = !!user.isAdmin
    } else if (filterStatus === "disabled") {
      matchesStatus = user.isActive === false
    }

    return matchesSearch && matchesStatus
  })

  const handleEditUser = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setEditUser({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        language: user.language,
      })
      setSelectedUser(userId)
      setIsEditDialogOpen(true)
    }
  }

  const handleDeleteUser = (userId: number) => {
    setSelectedUser(userId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (selectedUser === null) return

    deleteUser(selectedUser)

    toast({
      title: "User deleted",
      description: "The user has been permanently deleted.",
    })

    setIsDeleteDialogOpen(false)
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

    setIsEditDialogOpen(false)
  }

  const handleToggleUserActive = (userId: number, currentStatus: boolean) => {
    setUserActive(userId, !currentStatus)

    toast({
      title: currentStatus ? "User deactivated" : "User activated",
      description: currentStatus
        ? "User will no longer be able to access the system."
        : "User can now access the system.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts and subscriptions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            value={filterStatus}
            onValueChange={(value: "all" | "active" | "inactive" | "pending" | "admin" | "disabled") =>
              setFilterStatus(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Subscription</SelectItem>
              <SelectItem value="inactive">Inactive Subscription</SelectItem>
              <SelectItem value="pending">Pending Payment</SelectItem>
              <SelectItem value="admin">Admin Users</SelectItem>
              <SelectItem value="disabled">Disabled Users</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setFilterStatus("all")
            }}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Reset filters</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className={!user.isActive ? "bg-muted/30" : ""}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "—"}</TableCell>
                    <TableCell>{new Date(user.registrationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {!user.isActive ? (
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                          Disabled
                        </Badge>
                      ) : user.isAdmin ? (
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
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleUserActive(user.id, user.isActive !== false)}
                          className={user.isActive === false ? "text-green-600" : "text-red-600"}
                          disabled={user.isAdmin} // Don't allow disabling admin users
                        >
                          {user.isActive === false ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                          <span className="sr-only">{user.isActive === false ? "Enable" : "Disable"}</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        {!user.isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
              <Select
                value={editUser.language}
                onValueChange={(value: "en" | "sw") => setEditUser({ ...editUser, language: value })}
              >
                <SelectTrigger id="edit-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="sw">Swahili</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDeleteUser}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
