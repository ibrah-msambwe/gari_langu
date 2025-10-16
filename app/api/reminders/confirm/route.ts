import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

/**
 * API Route to send immediate confirmation email when reminder is created
 * Called automatically when user creates a reminder
 */
export async function POST(request: Request) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      )
    }

    const { reminderId, immediate } = await request.json()
    
    if (!reminderId) {
      return NextResponse.json(
        { error: "Reminder ID is required" },
        { status: 400 }
      )
    }
    
    // Fetch reminder with user and car details
    const { data: reminder, error } = await supabase
      .from("reminders")
      .select(`
        *,
        users!reminders_user_id_fkey (name, email, phone),
        cars!reminders_car_id_fkey (make, model, license_plate, year)
      `)
      .eq("id", reminderId)
      .single()
    
    if (error || !reminder) {
      console.error("[Confirm Email] Error fetching reminder:", error)
      return NextResponse.json(
        { error: "Reminder not found" },
        { status: 404 }
      )
    }
    
    const user = Array.isArray(reminder.users) ? reminder.users[0] : reminder.users
    const car = Array.isArray(reminder.cars) ? reminder.cars[0] : reminder.cars
    
    if (!user || !car) {
      return NextResponse.json(
        { error: "Missing user or car data" },
        { status: 400 }
      )
    }
    
    // Calculate days until due
    const today = new Date()
    const dueDate = new Date(reminder.due_date)
    const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    // Prepare email content
    const subject = `✅ Reminder Created: ${reminder.service_type} for ${car.make} ${car.model}`
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">✅ Reminder Created Successfully!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hi ${user.name},</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Great! You've successfully created a service reminder for your <strong>${car.make} ${car.model}</strong>.
          </p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3 style="color: #065f46; margin-top: 0;">Reminder Details:</h3>
            <p style="margin: 8px 0; color: #047857;"><strong>🚗 Vehicle:</strong> ${car.make} ${car.model} ${car.year}</p>
            <p style="margin: 8px 0; color: #047857;"><strong>📋 License Plate:</strong> ${car.license_plate}</p>
            <p style="margin: 8px 0; color: #047857;"><strong>🔧 Service Type:</strong> ${reminder.service_type}</p>
            <p style="margin: 8px 0; color: #047857;"><strong>📅 Due Date:</strong> ${new Date(reminder.due_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 8px 0; color: #047857;"><strong>⏰ Days Until Due:</strong> ${daysUntil} days</p>
            <p style="margin: 8px 0; color: #047857;"><strong>⚡ Priority:</strong> ${reminder.priority.toUpperCase()}</p>
            ${reminder.notes ? `<p style="margin: 8px 0; color: #047857;"><strong>📝 Notes:</strong> ${reminder.notes}</p>` : ''}
          </div>
          
          <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>📧 You will receive a reminder notification ${daysUntil > 7 ? '7 days' : `${daysUntil} days`} before the due date.</strong>
            </p>
            <p style="margin: 5px 0 0 0; color: #1e40af; font-size: 14px;">
              ${user.phone ? '📱 Notifications will be sent via Email and SMS.' : '📧 Notifications will be sent via Email.'}
            </p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            You can manage your reminders anytime from your dashboard.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/reminders" 
               style="display: inline-block; padding: 14px 28px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              View All Reminders
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
          
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This is an automated confirmation from Gari Langu<br>
            Track your vehicle maintenance and never miss a service!<br>
            Need help? Contact us at msambwe2@gmail.com
          </p>
        </div>
      </div>
    `
    
    // Log email content
    console.log("[Confirm Email] Sending email:")
    console.log("To:", user.email)
    console.log("Subject:", subject)
    console.log("Car:", `${car.make} ${car.model} (${car.license_plate})`)
    console.log("Due:", reminder.due_date, `(${daysUntil} days)`)
    
    // Send actual email if Resend API key is configured
    let emailSent = false;
    let smsSent = false;
    
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = require('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Gari Langu <noreply@yourdomain.com>',
          to: user.email,
          subject: subject,
          html: htmlContent
        })
        
        emailSent = true;
        console.log("[Confirm Email] ✅ Email sent successfully to:", user.email)
      } catch (emailError) {
        console.error("[Confirm Email] ❌ Failed to send email:", emailError)
      }
    } else {
      console.log("[Confirm Email] ⚠️ RESEND_API_KEY not configured - email not sent")
      console.log("[Confirm Email] To enable emails: Add RESEND_API_KEY to .env.local")
    }
    
    // Send SMS if phone number exists and SMS service is configured
    if (user.phone && reminder.notification_types && reminder.notification_types.includes('sms')) {
      const smsMessage = `🚗 Gari Langu: Reminder created for ${car.make} ${car.model} (${car.license_plate}). Service: ${reminder.service_type}, Due: ${new Date(reminder.due_date).toLocaleDateString()}. You'll be notified ${daysUntil > 7 ? '7 days' : `${daysUntil} days`} before.`
      
      if (process.env.AFRICAS_TALKING_API_KEY && process.env.AFRICAS_TALKING_USERNAME) {
        try {
          // Africa's Talking SMS (for Tanzania)
          const response = await fetch('https://api.africastalking.com/version1/messaging', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'apiKey': process.env.AFRICAS_TALKING_API_KEY,
              'Accept': 'application/json'
            },
            body: new URLSearchParams({
              username: process.env.AFRICAS_TALKING_USERNAME,
              to: user.phone,
              message: smsMessage
            })
          })
          
          if (response.ok) {
            smsSent = true;
            console.log("[Confirm SMS] ✅ SMS sent successfully to:", user.phone)
          } else {
            console.error("[Confirm SMS] ❌ Failed to send SMS:", await response.text())
          }
        } catch (smsError) {
          console.error("[Confirm SMS] ❌ SMS error:", smsError)
        }
      } else if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        try {
          // Twilio SMS (alternative)
          const twilioAuth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')
          
          const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${twilioAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              To: user.phone,
              From: process.env.TWILIO_PHONE_NUMBER,
              Body: smsMessage
            })
          })
          
          if (response.ok) {
            smsSent = true;
            console.log("[Confirm SMS] ✅ SMS sent successfully to:", user.phone)
          } else {
            console.error("[Confirm SMS] ❌ Failed to send SMS:", await response.text())
          }
        } catch (smsError) {
          console.error("[Confirm SMS] ❌ SMS error:", smsError)
        }
      } else {
        console.log("[Confirm SMS] ⚠️ SMS service not configured")
        console.log("[Confirm SMS] To enable SMS: Add Africa's Talking or Twilio credentials to .env.local")
      }
    }
    
    return NextResponse.json({
      success: true,
      message: emailSent ? "Confirmation email sent" : "Email prepared (configure RESEND_API_KEY to send)",
      emailSent,
      smsSent,
      reminder: {
        id: reminderId,
        car: `${car.make} ${car.model}`,
        service: reminder.service_type,
        dueDate: reminder.due_date,
        daysUntil: daysUntil
      }
    })
  } catch (error) {
    console.error("[Confirm Email] Error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

