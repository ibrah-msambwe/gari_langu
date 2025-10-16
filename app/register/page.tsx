"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useAuthStore } from "@/lib/auth-store"
import { useNotificationStore } from "@/lib/notification-store"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { customList } from 'country-codes-list'

export default function Register() {
  const router = useRouter()
  const { sendUserRegistrationNotification } = useNotificationStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")

  // Remove country code logic

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setFormError("")

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validate passwords match
    if (password !== confirmPassword) {
      setIsLoading(false)
      setFormError("Passwords do not match")
      return
    }

    // Validate password strength (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setIsLoading(false)
      setFormError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.")
      return
    }

    // Validate phone number starts with country code (e.g., +255)
    if (!/^\+\d{6,}/.test(phone)) {
      setIsLoading(false)
      setFormError("Phone number must start with a country code, e.g., +255...")
      return
    }

    try {
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            name: name,
            phone: phone,
          }
        }
      })
      
      if (error) {
        setIsLoading(false)
        setFormError(error.message)
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }
      
      // Insert user profile into custom users table
      if (data.user) {
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: data.user.id,
            email,
            name,
            phone: phone,
            trial_end: trialEnd.toISOString(),
            is_active: true,
            is_subscribed: false,
            subscription_end_date: null,
            is_admin: false
          }
        ])
        
        if (profileError) {
          console.error("Profile insert error:", profileError);
          // Don't fail the registration if profile creation fails
          // The user can still login and we can create the profile later
          console.warn("Profile will be created on first login");
        }
      }
      
      setIsLoading(false)
      
      // Show success message with email confirmation instructions
      toast({
        title: "Registration successful! 🎉",
        description: "Please check your email to confirm your account, then you can login.",
        duration: 7000,
      })
      
      // Redirect to login page with success state
      router.push("/login?registered=true")
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false)
      setFormError("An error occurred during registration. Please try again.")
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)
    setFormError("")
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
      if (error) {
        setIsLoading(false)
        setFormError(error.message)
        toast({
          title: "Google sign-in failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }
      // The user will be redirected by Supabase, so no further action is needed here
    } catch (error) {
      setIsLoading(false)
      setFormError("An error occurred during Google sign-in. Please try again.")
      toast({
        title: "Google sign-in failed",
        description: "An error occurred during Google sign-in. Please try again.",
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
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
        </div>
        <Card>
          <form onSubmit={onSubmit}>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                {formError && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{formError}</div>}
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="Ibrahim Msambwe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="example@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="e.g. +255712345678 (include country code)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" required />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 mb-2"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_17_40)">
                      <path d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24V29.1H37.4C36.7 32.2 34.7 34.7 31.8 36.4V42.1H39.3C44 38 47.5 31.9 47.5 24.5Z" fill="#4285F4"/>
                      <path d="M24 48C30.6 48 36.2 45.8 39.3 42.1L31.8 36.4C30.1 37.5 27.9 38.2 24 38.2C17.7 38.2 12.2 34.1 10.3 28.7H2.5V34.6C5.6 41.1 13.1 48 24 48Z" fill="#34A853"/>
                      <path d="M10.3 28.7C9.8 27.6 9.5 26.4 9.5 25.2C9.5 24 9.8 22.8 10.3 21.7V15.8H2.5C0.8 19 0 22.4 0 25.2C0 28 0.8 31.4 2.5 34.6L10.3 28.7Z" fill="#FBBC05"/>
                      <path d="M24 9.8C27.6 9.8 30.1 11.3 31.4 12.5L39.4 5.1C36.2 2.1 30.6 0 24 0C13.1 0 5.6 6.9 2.5 13.4L10.3 19.3C12.2 13.9 17.7 9.8 24 9.8Z" fill="#EA4335"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_17_40">
                        <rect width="48" height="48" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
