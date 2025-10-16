"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { useLanguage } from "./language-provider"
import { Settings, LogOut, User, CreditCard, ShieldCheck } from "lucide-react"
import { differenceInDays } from "date-fns"

export function UserNav() {
  const { currentUser, logout, isAdmin } = useAuthStore()
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  function DaysLeftBadge({ user }) {
    if (!user) return null
    const now = new Date()
    if (user.isSubscribed && user.subscriptionEndDate) {
      const days = differenceInDays(new Date(user.subscriptionEndDate), now)
      if (days < 0) return <span className="text-red-500 text-xs ml-2">Subscription expired</span>
      return <span className="text-green-600 text-xs ml-2">{days} days left</span>
    } else {
      const days = differenceInDays(new Date(user.trialEndDate), now)
      if (days < 0) return <span className="text-red-500 text-xs ml-2">Trial expired</span>
      return <span className="text-yellow-600 text-xs ml-2">{days} days left (trial)</span>
    }
  }

  if (!currentUser) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.email} <DaysLeftBadge user={currentUser} /></p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {!isAdmin && (
            <>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/subscription")}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Subscription</span>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}

          {isAdmin && (
            <>
              <DropdownMenuItem onClick={() => router.push("/admin")}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/users")}>
                <User className="mr-2 h-4 w-4" />
                <span>Manage Users</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/payments")}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Manage Payments</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
