"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function ForgotPassword() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setFormError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

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

      setEmailSent(true)
      setIsLoading(false)
      toast({
        title: "Password reset email sent!",
        description: "Check your email for the password reset link.",
      })
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
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Forgot Password?</h1>
          <p className="text-sm text-muted-foreground">
            No worries! Enter your email address and we'll send you a reset link.
          </p>
        </div>

        {emailSent ? (
          <Card className="elevation-2">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-center">Email Sent!</CardTitle>
              <CardDescription className="text-center">
                We've sent a password reset link to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Next steps:</strong>
                </p>
                <ol className="mt-2 ml-4 list-decimal text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>Check your email inbox</li>
                  <li>Click the reset password link</li>
                  <li>Create a new password</li>
                  <li>Login with your new password</li>
                </ol>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/login" className="w-full">
                <Button className="w-full min-h-[44px]">
                  Back to Login
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full min-h-[44px]" 
                onClick={() => {
                  setEmailSent(false)
                  setFormError("")
                }}
              >
                Try Another Email
              </Button>
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
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@example.com"
                      required
                      className="min-h-[44px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the email address associated with your account
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full min-h-[44px] touch-feedback" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reset Link
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

