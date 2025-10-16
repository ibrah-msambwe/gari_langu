import { NextResponse } from "next/server"
import { checkAndSendReminders } from "@/lib/notification-service"

/**
 * API Route to send reminder notifications
 * Can be called by:
 * 1. Cron job (Vercel Cron, GitHub Actions, etc.)
 * 2. Manual trigger from admin panel
 * 3. Scheduled task
 * 
 * Usage: POST /api/reminders/send
 * Optional header: x-cron-secret for security
 */
export async function POST(request: Request) {
  try {
    // Optional: Verify cron secret for security
    const cronSecret = request.headers.get("x-cron-secret")
    const expectedSecret = process.env.CRON_SECRET
    
    if (expectedSecret && cronSecret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    console.log("[API] Reminder notification request received")
    
    // Check and send reminders
    const result = await checkAndSendReminders()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully sent ${result.sent} reminder notifications`,
        sent: result.sent
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          message: "Failed to send reminders"
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[API] Error sending reminders:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Server error"
      },
      { status: 500 }
    )
  }
}

/**
 * GET method for testing (remove in production or add authentication)
 */
export async function GET() {
  return NextResponse.json({
    message: "Reminder notification API",
    usage: "POST /api/reminders/send",
    note: "Set x-cron-secret header for security"
  })
}

