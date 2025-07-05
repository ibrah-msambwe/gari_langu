import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Car, Bell, History, CreditCard, Check, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Gari Langu</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
              <Link href="/login-admin">
                <Button variant="ghost" size="icon">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="sr-only">Admin Login</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Manage Your Cars With Ease
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Register your vehicles, track service history, and receive timely maintenance reminders.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="mx-auto grid max-w-5xl gap-6 px-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Car Registration</h3>
              <p className="text-muted-foreground">Register all your vehicles with detailed information and images.</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Service Reminders</h3>
              <p className="text-muted-foreground">
                Get timely notifications for upcoming maintenance via email and SMS.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <History className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Service History</h3>
              <p className="text-muted-foreground">
                Track all maintenance records and service history for each vehicle.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start with a 7-day free trial. No credit card required.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col rounded-3xl border bg-background p-8">
              <h3 className="text-lg font-semibold leading-8">Free Trial</h3>
              <p className="mt-4 text-sm text-muted-foreground">Try all features for 7 days with no commitment.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight">0</span>
                <span className="text-sm font-semibold leading-6 text-muted-foreground">TZS</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  <span>Register unlimited vehicles</span>
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  <span>Track service history</span>
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  <span>Set service reminders</span>
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  <span>7 days access</span>
                </li>
              </ul>
              <Link href="/register" className="mt-8">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>

            <div className="flex flex-col rounded-3xl border bg-background p-8 ring-1 ring-primary">
              <h3 className="text-lg font-semibold leading-8">Monthly Subscription</h3>
              <p className="mt-4 text-sm text-muted-foreground">Full access to all features at an affordable price.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight">1,000</span>
                <span className="text-sm font-semibold leading-6 text-muted-foreground">TZS/month</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  <span>Register unlimited vehicles</span>
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  <span>Track service history</span>
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  <span>Set service reminders</span>
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  <span>Email and SMS notifications</span>
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  <span>Priority support</span>
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  <span>Pay with Tigo Pesa</span>
                </li>
              </ul>
              <Link href="/register" className="mt-8">
                <Button className="w-full" variant="default">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscribe Now
                </Button>
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="text-sm text-muted-foreground">Payment via Tigo Pesa to +255 712 815 726 (Ibrahim Msambwe)</p>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Gari Langu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
