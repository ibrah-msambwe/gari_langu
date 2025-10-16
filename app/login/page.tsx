"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useAuthStore } from "@/lib/auth-store"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Mail } from "lucide-react"

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)

  useEffect(() => {
    // Check if user just registered
    if (searchParams.get('registered') === 'true') {
      setShowEmailConfirmation(true)
      toast({
        title: "Check your email! 📧",
        description: "We've sent you a confirmation link. Click it to activate your account.",
        duration: 8000,
      })
    }
  }, [searchParams, toast])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setFormError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("Attempting login for:", email);

    // Attempt to login using Supabase Auth
    const result = await login(email, password)

    if (result && 'user' in result && result.user) {
      toast({
        title: "Login successful",
        description: "Welcome back to Gari Langu!",
      })
      setTimeout(() => {
        setIsLoading(false)
        router.push("/dashboard")
      }, 1000)
    } else {
      setIsLoading(false)
      let errorMsg = 'error' in result && result.error?.message || "Incorrect email or password. Please try again."
      
      // Provide more helpful error messages
      if (errorMsg.includes("Invalid login credentials")) {
        errorMsg = "Incorrect email or password. Please check your credentials and try again."
      } else if (errorMsg.includes("Email not confirmed")) {
        errorMsg = "Please check your email and confirm your account before logging in."
      } else if (errorMsg.includes("User not found")) {
        errorMsg = "No account found with this email. Please register first."
      }
      
      console.log("Login error:", errorMsg);
      setFormError(errorMsg)
      toast({
        title: "Login failed",
        description: errorMsg,
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
          <span className="ml-2">Back</span>
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login to your account</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials below to access your account</p>
        </div>
        {showEmailConfirmation && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800 elevation-1">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">Email Confirmation Required</h3>
                <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                  Please check your email and click the confirmation link before logging in.
                  Check your spam folder if you don't see it.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Card className="elevation-2">
          <form onSubmit={onSubmit}>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                {formError && (
                  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                    {formError}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="example@example.com" 
                    required 
                    className="min-h-[44px]"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    className="min-h-[44px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full min-h-[44px] touch-feedback ripple" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="flex flex-col space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            <Link href="/login-admin" className="underline underline-offset-4 hover:text-primary">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
