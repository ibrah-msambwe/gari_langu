import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { Toaster, GlobalLoadingBar } from "@/components/ui/toaster"
import { AuthGuard } from "@/components/auth-guard"
import { AuthSessionProvider } from "@/components/AuthSessionProvider"
import { SessionRestorer } from "@/components/SessionRestorer";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gari Langu - Car Management System",
  description: "Manage your vehicles, track service history, and receive maintenance reminders",
    generator: 'v0.dev'
}

// Make sure the ThemeProvider is properly initialized
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionRestorer />
        <GlobalLoadingBar />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthSessionProvider>
              <AuthGuard>
                {children}
                <Toaster />
              </AuthGuard>
            </AuthSessionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}