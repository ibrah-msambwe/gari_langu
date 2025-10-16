import { supabase } from "./supabaseClient"
import { Resend } from 'resend'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Service Reminder Notification System
 * This is the brain of the system - sends email and SMS notifications for service reminders
 */

export interface ReminderNotification {
  id: number
  user_id: string
  user_name: string
  user_email: string
  user_phone: string | null
  car_make: string
  car_model: string
  car_license_plate: string
  service_type: string
  due_date: string
  priority: string
  notes: string | null
  days_until_due: number
}

/**
 * Check for upcoming reminders and send notifications
 * Should be called daily via cron job or scheduled function
 */
export async function checkAndSendReminders() {
  console.log("[Reminder Service] Checking for upcoming reminders...")
  
  try {
    // Get reminders due in the next 7 days that haven't been notified yet
    const today = new Date()
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(today.getDate() + 7)
    
    const { data: reminders, error } = await supabase
      .from("reminders")
      .select(`
        *,
        users!reminders_user_id_fkey (name, email, phone),
        cars!reminders_car_id_fkey (make, model, license_plate)
      `)
      .eq("status", "pending")
      .eq("notification_sent", false)
      .gte("due_date", today.toISOString().split('T')[0])
      .lte("due_date", sevenDaysFromNow.toISOString().split('T')[0])
    
    if (error) {
      console.error("[Reminder Service] Error fetching reminders:", error)
      return { success: false, error }
    }
    
    if (!reminders || reminders.length === 0) {
      console.log("[Reminder Service] No reminders to send")
      return { success: true, sent: 0 }
    }
    
    console.log(`[Reminder Service] Found ${reminders.length} reminders to send`)
    
    let sentCount = 0
    
    // Process each reminder
    for (const reminder of reminders) {
      const user = Array.isArray(reminder.users) ? reminder.users[0] : reminder.users
      const car = Array.isArray(reminder.cars) ? reminder.cars[0] : reminder.cars
      
      if (!user || !car) {
        console.error("[Reminder Service] Missing user or car data for reminder:", reminder.id)
        continue
      }
      
      const daysUntilDue = Math.ceil((new Date(reminder.due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      const notificationData: ReminderNotification = {
        id: reminder.id,
        user_id: reminder.user_id,
        user_name: user.name,
        user_email: user.email,
        user_phone: user.phone,
        car_make: car.make,
        car_model: car.model,
        car_license_plate: car.license_plate,
        service_type: reminder.service_type,
        due_date: reminder.due_date,
        priority: reminder.priority,
        notes: reminder.notes,
        days_until_due: daysUntilDue
      }
      
      // Send email notification
      const emailSent = await sendEmailNotification(notificationData)
      
      // Send SMS notification if phone number exists
      let smsSent = false
      if (user.phone) {
        smsSent = await sendSMSNotification(notificationData)
      }
      
      // Mark notification as sent if at least one method succeeded
      if (emailSent || smsSent) {
        await supabase
          .from("reminders")
          .update({ notification_sent: true })
          .eq("id", reminder.id)
        
        sentCount++
        console.log(`[Reminder Service] Sent notification for reminder ${reminder.id}`)
      }
    }
    
    console.log(`[Reminder Service] Sent ${sentCount} notifications`)
    return { success: true, sent: sentCount }
  } catch (error) {
    console.error("[Reminder Service] Error:", error)
    return { success: false, error }
  }
}

/**
 * Send email notification for a reminder
 */
async function sendEmailNotification(data: ReminderNotification): Promise<boolean> {
  console.log(`[Email] Sending email to ${data.user_email} for reminder ${data.id}`)
  
  const subject = `🔔 Service Reminder: ${data.service_type} for ${data.car_make} ${data.car_model}`
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">🔔 Service Reminder</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937; margin-top: 0;">Hi ${data.user_name},</h2>
        
        <p style="color: #4b5563; line-height: 1.6;">
          This is a friendly reminder that your <strong>${data.service_type}</strong> for your 
          <strong>${data.car_make} ${data.car_model}</strong> (${data.car_license_plate}) is due soon!
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0; color: #374151;"><strong>Due Date:</strong> ${new Date(data.due_date).toLocaleDateString()}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Days Until Due:</strong> ${data.days_until_due} days</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Service Type:</strong> ${data.service_type}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Priority:</strong> ${data.priority}</p>
          ${data.notes ? `<p style="margin: 5px 0; color: #374151;"><strong>Notes:</strong> ${data.notes}</p>` : ''}
        </div>
        
        <p style="color: #4b5563;">
          Log in to Gari Langu to mark this service as completed or reschedule.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/reminders" 
             style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            View Reminder
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
          This is an automated reminder from Gari Langu<br>
          You're receiving this because you have an active service reminder.<br>
          Need help? Contact us at msambwe2@gmail.com
        </p>
      </div>
    </div>
  `
  
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log("[Email] RESEND_API_KEY not configured, skipping email send")
      console.log("[Email] Email content prepared:")
      console.log("To:", data.user_email)
      console.log("Subject:", subject)
      console.log("Days until due:", data.days_until_due)
      return true // Return true for development
    }
    
    // Send email using Resend
    const { data: emailData, error } = await resend.emails.send({
      from: 'Gari Langu <noreply@garilangu.com>',
      to: data.user_email,
      subject: subject,
      html: htmlContent
    })
    
    if (error) {
      console.error("[Email] Resend error:", error)
      return false
    }
    
    console.log("[Email] Email sent successfully:", emailData?.id)
    return true
  } catch (error) {
    console.error("[Email] Error sending email:", error)
    return false
  }
}

/**
 * Send SMS notification for a reminder
 */
async function sendSMSNotification(data: ReminderNotification): Promise<boolean> {
  if (!data.user_phone) {
    console.log("[SMS] No phone number for user, skipping SMS")
    return false
  }
  
  console.log(`[SMS] Sending SMS to ${data.user_phone} for reminder ${data.id}`)
  
  const message = `🔔 Gari Langu Reminder: ${data.service_type} for ${data.car_make} ${data.car_model} (${data.car_license_plate}) is due in ${data.days_until_due} days on ${new Date(data.due_date).toLocaleDateString()}. Login to view details: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`
  
  try {
    // TODO: Integrate with SMS provider (Twilio, Africa's Talking, etc.)
    // Example with Africa's Talking:
    // const response = await fetch('https://api.africastalking.com/version1/messaging', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'apiKey': process.env.AFRICAS_TALKING_API_KEY
    //   },
    //   body: new URLSearchParams({
    //     username: process.env.AFRICAS_TALKING_USERNAME,
    //     to: data.user_phone,
    //     message: message
    //   })
    // })
    
    console.log("[SMS] SMS content prepared:")
    console.log("To:", data.user_phone)
    console.log("Message:", message)
    
    // For now, return true (implement actual SMS sending in production)
    return true
  } catch (error) {
    console.error("[SMS] Error sending SMS:", error)
    return false
  }
}

/**
 * Manual trigger to send notification for a specific reminder
 */
export async function sendReminderNotification(reminderId: number): Promise<boolean> {
  console.log(`[Reminder Service] Sending notification for reminder ${reminderId}`)
  
  try {
    const { data: reminder, error } = await supabase
      .from("reminders")
      .select(`
        *,
        users!reminders_user_id_fkey (name, email, phone),
        cars!reminders_car_id_fkey (make, model, license_plate)
      `)
      .eq("id", reminderId)
      .single()
    
    if (error || !reminder) {
      console.error("[Reminder Service] Error fetching reminder:", error)
      return false
    }
    
    const user = Array.isArray(reminder.users) ? reminder.users[0] : reminder.users
    const car = Array.isArray(reminder.cars) ? reminder.cars[0] : reminder.cars
    
    if (!user || !car) {
      console.error("[Reminder Service] Missing user or car data")
      return false
    }
    
    const today = new Date()
    const daysUntilDue = Math.ceil((new Date(reminder.due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    const notificationData: ReminderNotification = {
      id: reminder.id,
      user_id: reminder.user_id,
      user_name: user.name,
      user_email: user.email,
      user_phone: user.phone,
      car_make: car.make,
      car_model: car.model,
      car_license_plate: car.license_plate,
      service_type: reminder.service_type,
      due_date: reminder.due_date,
      priority: reminder.priority,
      notes: reminder.notes,
      days_until_due: daysUntilDue
    }
    
    // Send notifications
    const emailSent = await sendEmailNotification(notificationData)
    const smsSent = user.phone ? await sendSMSNotification(notificationData) : false
    
    // Mark as sent if at least one succeeded
    if (emailSent || smsSent) {
      await supabase
        .from("reminders")
        .update({ notification_sent: true })
        .eq("id", reminderId)
      
      return true
    }
    
    return false
  } catch (error) {
    console.error("[Reminder Service] Error:", error)
    return false
  }
}

