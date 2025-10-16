"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Lock, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function ResetPassword() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [passwordReset, setPasswordReset] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setFormError("")

    const formData = new FormData(event.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validate passwords match
    if (password !== confirmPassword) {
      setIsLoading(false)
      setFormError("Passwords do not match")
      return
    }

    // Validate password strength (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    if (!strongPasswordRegex.test(password)) {
      setIsLoading(false)
      setFormError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.")
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setIsLoading(false)
        setFormError(error.message)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setPasswordReset(true)
      setIsLoading(false)
      toast({
        title: "Password reset successful!",
        description: "Your password has been updated. You can now login with your new password.",
      })

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error) {
      setIsLoading(false)
      setFormError("An error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center px-4">
      <Link href="/login" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" className="touch-feedback">
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
          <span className="ml-2">Back to Login</span>
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
            <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Reset Your Password</h1>
          <p className="text-sm text-muted-foreground">
            Create a new secure password for your account
          </p>
        </div>

        {passwordReset ? (
          <Card className="elevation-2">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-center">Password Reset Complete!</CardTitle>
              <CardDescription className="text-center">
                Your password has been successfully updated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-center">
                <p className="text-sm text-green-900 dark:text-green-100">
                  Redirecting you to login page...
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full min-h-[44px]">
                  Go to Login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <Card className="elevation-2">
            <form onSubmit={onSubmit}>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  {formError && (
                    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                      {formError}
                    </div>
                  )}
                  
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                      <strong>Password Requirements:</strong>
                    </p>
                    <ul className="mt-1 ml-4 list-disc text-xs text-blue-800 dark:text-blue-200 space-y-0.5">
                      <li>At least 8 characters long</li>
                      <li>Contains uppercase letter</li>
                      <li>Contains lowercase letter</li>
                      <li>Contains a number</li>
                      <li>Contains a special character</li>
                    </ul>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="min-h-[44px]"
                      placeholder="Enter your new password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="min-h-[44px]"
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full min-h-[44px] touch-feedback ripple" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Reset Password
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <p className="px-4 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary font-medium">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}

