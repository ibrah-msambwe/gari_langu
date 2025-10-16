# Email Setup Guide - Gari Langu

## Overview

This guide will help you configure email notifications for Gari Langu, including:
- User registration confirmation emails
- Password reset emails
- Welcome emails
- Service reminder notifications

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Configure Supabase Email Settings

1. **Go to Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Configure Email Templates**
   - Go to **Authentication** > **Email Templates**
   - You'll see several templates to customize

### Step 2: Customize Email Templates

#### 1. Confirmation Email (Required for Login)

**Template: "Confirm signup"**

```html
<h2>Welcome to Gari Langu! 🚗</h2>
<p>Thank you for registering with Gari Langu - your personal car management system.</p>
<p>Please confirm your email address by clicking the button below:</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Confirm Email Address</a></p>
<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p><strong>What's Next?</strong></p>
<ul>
  <li>✅ Confirm your email</li>
  <li>🚗 Add your first vehicle</li>
  <li>📝 Track service history</li>
  <li>🔔 Set maintenance reminders</li>
</ul>
<p><strong>Your Free Trial:</strong></p>
<p>You get 7 days of free access to all features. After that, subscribe for only 1,000 TZS/month.</p>
<p>If you didn't create this account, you can safely ignore this email.</p>
<p>Best regards,<br>The Gari Langu Team</p>
```

#### 2. Password Reset Email

**Template: "Reset password"**

```html
<h2>Reset Your Password 🔒</h2>
<p>We received a request to reset your password for your Gari Langu account.</p>
<p>Click the button below to create a new password:</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a></p>
<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p><strong>Security Notice:</strong></p>
<ul>
  <li>This link will expire in 1 hour</li>
  <li>If you didn't request this, please ignore this email</li>
  <li>Your password will remain unchanged</li>
</ul>
<p>Need help? Contact us at msambwe2@gmail.com</p>
<p>Best regards,<br>The Gari Langu Team</p>
```

#### 3. Magic Link Email (Optional)

**Template: "Magic Link"**

```html
<h2>Login to Gari Langu 🚗</h2>
<p>Click the link below to securely login to your account:</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Login to Gari Langu</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this login link, please ignore this email.</p>
<p>Best regards,<br>The Gari Langu Team</p>
```

### Step 3: Configure Email Settings

1. **Email Auth Settings**
   - Go to **Authentication** > **Settings**
   - Scroll to **Email Auth**
   - Configure the following:

   ```
   Enable Email Confirmations: ✅ ON (IMPORTANT!)
   Enable Email Change Confirmations: ✅ ON
   Secure Email Change: ✅ ON
   ```

2. **Email Rate Limits**
   ```
   Rate Limit: 4 emails per hour (default is fine)
   ```

3. **Redirect URLs**
   - Go to **Authentication** > **URL Configuration**
   - Add your site URLs:
   ```
   Site URL: http://localhost:3000 (for development)
   Site URL: https://your-domain.com (for production)
   
   Redirect URLs:
   http://localhost:3000/**
   https://your-domain.com/**
   ```

---

## 📧 Email Providers

### Option 1: Use Supabase Default Email (Development)

**Pros:**
- ✅ Works out of the box
- ✅ No configuration needed
- ✅ Good for testing

**Cons:**
- ❌ Rate limited (4 emails/hour)
- ❌ May go to spam
- ❌ Not suitable for production

**Setup:** No setup needed! It works automatically.

### Option 2: Custom SMTP (Production Recommended)

**Providers:**
- **SendGrid** (Free: 100 emails/day)
- **Mailgun** (Free: 5,000 emails/month for 3 months)
- **Postmark** (Free: 100 emails/month)
- **Amazon SES** (Very cheap, pay as you go)

**Setup Steps:**

1. **Choose Provider & Get SMTP Credentials**
   - Sign up for your preferred provider
   - Get SMTP host, port, username, and password

2. **Configure in Supabase**
   - Go to **Project Settings** > **Auth** > **SMTP Settings**
   - Enable Custom SMTP
   - Fill in:
     ```
     Host: smtp.sendgrid.net (or your provider)
     Port: 587
     Username: your_username
     Password: your_password
     Sender Email: noreply@yourdomain.com
     Sender Name: Gari Langu
     ```

3. **Test Email Delivery**
   - Register a new test user
   - Check if confirmation email arrives
   - Check spam folder if needed

---

## 🎯 Current Email Triggers

### Automatically Sent by Supabase

1. **User Registration** ✅
   - Trigger: New user signs up
   - Email: Confirmation email with link
   - Action: User clicks link to verify email
   - Result: User can now login

2. **Password Reset Request** ✅
   - Trigger: User clicks "Forgot Password"
   - Email: Reset password email with link
   - Action: User clicks link and sets new password
   - Result: User can login with new password

3. **Email Change** (if enabled)
   - Trigger: User changes email in settings
   - Email: Confirmation to both old and new email
   - Action: User confirms change
   - Result: Email updated

---

## 📝 Additional Email Notifications (To Be Implemented)

### Service Reminders

**When:** Reminder due date is approaching

**Email Template:**
```
Subject: 🔔 Service Reminder: [Service Type] for [Car Make Model]

Hi [User Name],

This is a friendly reminder that your [Service Type] for your [Car Make Model] ([License Plate]) is due soon!

Due Date: [Due Date]
Service Type: [Service Type]
Priority: [Priority]

Log in to Gari Langu to mark this service as completed or reschedule.

[View Reminder Button]

Best regards,
The Gari Langu Team
```

**Implementation:** Use Supabase Edge Functions or external service

### Payment Verification

**When:** Admin verifies payment

**Email Template:**
```
Subject: ✅ Payment Verified - Subscription Active

Hi [User Name],

Great news! Your payment has been verified and your subscription is now active.

Payment Details:
- Amount: [Amount] TZS
- Duration: [Months] month(s)
- Subscription Valid Until: [End Date]

You now have full access to all Gari Langu features!

[Go to Dashboard Button]

Thank you for subscribing!

Best regards,
The Gari Langu Team
```

### Payment Rejection

**When:** Admin rejects payment

**Email Template:**
```
Subject: ⚠️ Payment Issue - Action Required

Hi [User Name],

We were unable to verify your recent payment submission.

Reason: [Admin Notes]

Please:
1. Check your payment details
2. Submit a new payment proof
3. Contact support if you need help

[Submit New Payment Button]

Need Help? Reply to this email or contact: msambwe2@gmail.com

Best regards,
The Gari Langu Team
```

---

## 🛠️ Testing Email Delivery

### Test 1: Registration Email

1. **Register New User:**
   ```bash
   # Go to: http://localhost:3000/register
   # Fill in details and submit
   ```

2. **Check Email:**
   - Check inbox
   - Check spam folder
   - Look for confirmation email

3. **Verify:**
   - ✅ Email received within 1 minute
   - ✅ Confirmation link works
   - ✅ Redirects to correct page
   - ✅ User can login after confirmation

### Test 2: Password Reset Email

1. **Request Reset:**
   ```bash
   # Go to: http://localhost:3000/forgot-password
   # Enter email and submit
   ```

2. **Check Email:**
   - Check inbox
   - Look for reset email

3. **Verify:**
   - ✅ Email received within 1 minute
   - ✅ Reset link works
   - ✅ Can set new password
   - ✅ Can login with new password

### Test 3: Email Deliverability

1. **Test with Gmail:**
   - Use Gmail address
   - Check if email arrives
   - Check if it's in spam

2. **Test with Other Providers:**
   - Yahoo Mail
   - Outlook
   - Custom domain

---

## 🔧 Troubleshooting

### Problem: Confirmation Email Not Received

**Solutions:**

1. **Check Spam Folder**
   - Most common issue
   - Mark as "Not Spam"

2. **Check Supabase Email Queue**
   - Go to Authentication > Logs
   - Check for email send errors

3. **Check Rate Limits**
   - Default: 4 emails per hour
   - Wait or upgrade to custom SMTP

4. **Verify Email Settings**
   - Go to Authentication > Email Templates
   - Check templates are enabled
   - Check redirect URLs are correct

### Problem: "Email not confirmed" Error

**Solutions:**

1. **Disable Email Confirmation (Development Only)**
   - Go to Authentication > Settings
   - Turn OFF "Enable Email Confirmations"
   - ⚠️ **Not recommended for production!**

2. **Manually Confirm User (Development)**
   ```sql
   -- In Supabase SQL Editor
   UPDATE auth.users
   SET email_confirmed_at = NOW()
   WHERE email = 'user@example.com';
   ```

3. **Resend Confirmation Email**
   ```typescript
   // Add this to your app
   const { error } = await supabase.auth.resend({
     type: 'signup',
     email: 'user@example.com'
   })
   ```

### Problem: Reset Password Link Not Working

**Solutions:**

1. **Check Link Expiry**
   - Links expire after 1 hour
   - Request new reset link

2. **Check Redirect URL**
   - Must be in allowed redirect URLs
   - Check Authentication > URL Configuration

3. **Clear Browser Cache**
   - Sometimes old data causes issues
   - Try in incognito mode

---

## 🎨 Email Best Practices

### Design

1. **Keep it Simple**
   - Clear subject line
   - Single call-to-action
   - Mobile-responsive

2. **Branding**
   - Use Gari Langu logo
   - Consistent colors (blue/indigo)
   - Professional tone

3. **Content**
   - Short and clear
   - Bullet points for easy reading
   - Include contact information

### Deliverability

1. **Avoid Spam Filters**
   - Use proper SPF/DKIM records (with custom SMTP)
   - Don't use spammy words
   - Include unsubscribe link

2. **Testing**
   - Test on multiple email providers
   - Check mobile email clients
   - Verify links work

---

## 📊 Current Email Flow

### Registration Flow

```
User Registers
    ↓
Supabase sends confirmation email
    ↓
User clicks confirmation link
    ↓
Email confirmed in database
    ↓
User can login
    ↓
Trial period starts (7 days)
```

### Password Reset Flow

```
User clicks "Forgot Password"
    ↓
Enters email address
    ↓
Supabase sends reset email
    ↓
User clicks reset link
    ↓
User enters new password
    ↓
Password updated
    ↓
User can login with new password
```

---

## 🔐 Security Best Practices

### Email Verification

1. **Always Require Email Confirmation**
   - Prevents fake accounts
   - Verifies email ownership
   - Reduces spam

2. **Rate Limiting**
   - Prevent email bombing
   - Limit password reset requests
   - Default: 4 emails/hour per user

3. **Link Expiry**
   - Confirmation links expire (default: 24 hours)
   - Reset links expire (default: 1 hour)
   - Prevents unauthorized access

---

## 🚀 Quick Fix: Allow Login Without Email Confirmation (Development Only)

**⚠️ WARNING: Only use this for development/testing!**

### In Supabase Dashboard:

1. Go to **Authentication** > **Settings**
2. Scroll to **Email Auth**
3. **Disable** "Enable Email Confirmations"
4. Save changes

**Now users can login immediately after registration (no email confirmation needed)**

### Re-enable for Production:

Before deploying to production, **ALWAYS** re-enable email confirmations for security!

---

## 📧 Setting Up Custom SMTP (Recommended for Production)

### Using SendGrid (Free Tier)

1. **Sign Up for SendGrid**
   - Go to https://sendgrid.com
   - Create free account (100 emails/day)

2. **Get API Key**
   - Go to Settings > API Keys
   - Create new API key
   - Copy the key

3. **Configure in Supabase**
   - Go to Project Settings > Auth > SMTP Settings
   - Enable Custom SMTP
   - Fill in:
     ```
     Host: smtp.sendgrid.net
     Port: 587
     Username: apikey
     Password: [Your SendGrid API Key]
     Sender Email: noreply@yourdomain.com
     Sender Name: Gari Langu
     ```

4. **Test**
   - Register a new test user
   - Check if email arrives faster
   - Should arrive within seconds!

---

## 📝 Email Notification Checklist

### Currently Working ✅

- [x] User registration confirmation
- [x] Password reset
- [x] Email change confirmation

### To Be Implemented 🔜

- [ ] Welcome email after confirmation
- [ ] Trial expiry reminder (5 days before)
- [ ] Service reminder notifications
- [ ] Payment verification notification
- [ ] Payment rejection notification
- [ ] Subscription renewal reminder

---

## 🎯 Implementation Guide for Additional Emails

### Using Supabase Edge Functions

1. **Create Edge Function**
   ```typescript
   // Send welcome email
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   
   serve(async (req) => {
     const { email, name } = await req.json()
     
     // Send email using your SMTP or email service
     // Use Resend, SendGrid, or Mailgun API
     
     return new Response(JSON.stringify({ success: true }))
   })
   ```

2. **Trigger from Your App**
   ```typescript
   // After successful registration
   await supabase.functions.invoke('send-welcome-email', {
     body: { email, name }
   })
   ```

### Using External Service (Easier)

**Option 1: Resend (Recommended)**
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'Gari Langu <noreply@yourdomain.com>',
  to: email,
  subject: 'Welcome to Gari Langu!',
  html: '<p>Welcome email content...</p>'
})
```

**Option 2: SendGrid API**
```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

await sgMail.send({
  to: email,
  from: 'noreply@yourdomain.com',
  subject: 'Welcome to Gari Langu!',
  html: '<p>Welcome email content...</p>'
})
```

---

## 🔍 Debugging Email Issues

### Check Email Logs

1. **In Supabase Dashboard:**
   - Go to Authentication > Logs
   - Filter by "email"
   - Check for send errors

2. **Common Errors:**
   - "Rate limit exceeded" → Wait or use custom SMTP
   - "Invalid email" → Check email format
   - "SMTP error" → Check SMTP configuration

### Test Email Delivery

```typescript
// Test function to verify email works
const testEmail = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) {
    console.error("Email test failed:", error)
  } else {
    console.log("Email test successful!")
  }
}
```

---

## 📱 Email on Mobile Devices

### Make Emails Mobile-Friendly

1. **Responsive Design**
   ```html
   <style>
     @media only screen and (max-width: 600px) {
       .button {
         width: 100% !important;
         display: block !important;
       }
     }
   </style>
   ```

2. **Large Tap Targets**
   - Buttons should be at least 44px height
   - Easy to tap on mobile

3. **Test on Devices**
   - iOS Mail
   - Gmail app
   - Outlook mobile

---

## ✅ Quick Start Summary

### For Development (Quick Test):

1. **Disable Email Confirmation** (temporarily)
   - Authentication > Settings
   - Turn OFF "Enable Email Confirmations"
   - Users can login immediately

### For Production (Recommended):

1. **Keep Email Confirmation Enabled**
2. **Set up Custom SMTP** (SendGrid recommended)
3. **Customize Email Templates**
4. **Test thoroughly**
5. **Monitor email deliverability**

---

## 📞 Support

### Email Issues?

1. **Check this guide first**
2. **Check Supabase docs:** https://supabase.com/docs/guides/auth/auth-smtp
3. **Contact support:** msambwe2@gmail.com

---

**Last Updated:** October 13, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation

