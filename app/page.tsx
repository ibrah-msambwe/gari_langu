import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Car, Bell, History, CreditCard, Check, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold">Gari Langu</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="h-9">Login</Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button size="sm" className="h-9">Register</Button>
              </Link>
              <Link href="/login-admin" className="hidden md:block">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="sr-only">Admin Login</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-8 md:py-16 lg:py-24 px-4">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-2xl font-bold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Manage Your Cars With Ease
            </h1>
            <p className="max-w-[750px] text-base sm:text-lg text-muted-foreground">
              Register your vehicles, track service history, and receive timely maintenance reminders.
            </p>
            <div className="flex flex-col gap-3 min-[400px]:flex-row w-full max-w-xs min-[400px]:max-w-none">
              <Link href="/register" className="w-full min-[400px]:w-auto">
                <Button size="lg" className="w-full min-[400px]:w-auto h-12 text-base">Get Started</Button>
              </Link>
              <Link href="#pricing" className="w-full min-[400px]:w-auto">
                <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto h-12 text-base">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="container py-8 md:py-16 lg:py-24 bg-muted/50 px-4">
          <div className="mx-auto grid max-w-5xl gap-6 md:gap-8 lg:grid-cols-3 lg:gap-12">
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

        <section id="pricing" className="container py-8 md:py-16 lg:py-24 px-4">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Start with a 7-day free trial. No credit card required.
            </p>
          </div>

          <div className="mx-auto mt-8 md:mt-16 max-w-5xl grid gap-6 md:gap-8 lg:grid-cols-2">
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
                <Button className="w-full h-12 text-base">Start Free Trial</Button>
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
                <Button className="w-full h-12 text-base" variant="default">
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
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Gari Langu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
