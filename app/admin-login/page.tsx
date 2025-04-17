"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/auth-store"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ShieldCheck } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const { loginAdmin } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setFormError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Attempt to login as admin
    const success = loginAdmin(email, password)

    if (success) {
      toast({
        title: "Admin login successful",
        description: "Welcome to the Gari Langu admin panel!",
      })

      setTimeout(() => {
        setIsLoading(false)
        router.push("/admin")
      }, 1000)
    } else {
      setIsLoading(false)
      setFormError("Invalid admin credentials. Please try again.")

      toast({
        title: "Admin login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-left"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span className="ml-2">Back to Home</span>
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto bg-primary text-primary-foreground p-2 rounded-full">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Enter your admin credentials to access the system</p>
        </div>
        <Card>
          <form onSubmit={onSubmit}>
            <CardHeader>
              <CardTitle className="text-center">Admin Access</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4">
                {formError && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{formError}</div>}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login as Admin"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Regular user login
          </Link>
        </p>
      </div>
    </div>
  )
}
