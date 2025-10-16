# Testing Guide for Gari Langu

## Pre-Deployment Checklist

### 1. Environment Setup

#### Verify Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to find these:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to Project Settings > API
4. Copy the Project URL and anon/public key

#### Verify Database Schema

Run the following SQL commands in your Supabase SQL Editor (in order):

1. **Users Table** (from DATABASE_SCHEMA.md)
2. **Cars Table** (from DATABASE_SCHEMA.md)
3. **Services Table** (from DATABASE_SCHEMA.md)
4. **Reminders Table** (from DATABASE_SCHEMA.md)
5. **Payments Table** (from DATABASE_SCHEMA.md)
6. **Notifications Table** (optional, from DATABASE_SCHEMA.md)
7. **Indexes** (from DATABASE_SCHEMA.md - for performance)

### 2. Authentication Testing

#### User Registration Flow

1. **Navigate to Registration Page**
   - Go to http://localhost:3000/register
   - Verify mobile responsiveness (resize browser or use mobile device)

2. **Test Registration**
   ```
   Name: Test User
   Email: test@example.com
   Phone: +255712345678
   Password: Test@1234
   Confirm Password: Test@1234
   ```

3. **Verify:**
   - ✅ Email validation works
   - ✅ Password strength validation works
   - ✅ Phone number requires country code
   - ✅ User receives email confirmation
   - ✅ User profile is created in `users` table
   - ✅ Trial period is set (7 days from registration)

#### User Login Flow

1. **Navigate to Login Page**
   - Go to http://localhost:3000/login

2. **Test Login**
   - Use credentials from registration
   - Verify redirect to dashboard

3. **Verify:**
   - ✅ Authentication state persists on refresh
   - ✅ User data loads correctly
   - ✅ Trial status displays correctly
   - ✅ Dashboard displays user email

#### Admin Login Flow

1. **Navigate to Admin Login**
   - Go to http://localhost:3000/login-admin

2. **Test with Admin Credentials**
   - Email: msambwe2@gmail.com
   - Password: Msambwe@4687 (fallback local admin)

3. **Verify:**
   - ✅ Admin flag is set
   - ✅ Can access /admin routes
   - ✅ Can view all users

### 3. Car Management Testing

#### Add Car

1. **Navigate to Add Car**
   - Click "Add Car" button from dashboard
   - Or go to /dashboard/cars/add

2. **Fill Form:**
   ```
   Make: Toyota
   Model: Corolla
   Year: 2020
   License Plate: T123ABC
   Color: White
   VIN: 1HGBH41JXMN109186
   Description: Test vehicle
   ```

3. **Verify:**
   - ✅ Form validation works
   - ✅ Image upload works (if implemented)
   - ✅ Car appears in cars list
   - ✅ Car data persists in database

#### View Car

1. **Navigate to Car Details**
   - Click "View" on any car card

2. **Verify:**
   - ✅ All car details display correctly
   - ✅ Service history is visible
   - ✅ Mobile layout is responsive

#### Edit Car

1. **Navigate to Edit Car**
   - Click "Edit" on any car card

2. **Update Information:**
   - Change color or other fields
   - Save changes

3. **Verify:**
   - ✅ Changes persist
   - ✅ Updated data displays correctly

#### Delete Car

1. **Delete Car**
   - Click "Delete" on any car card
   - Confirm deletion

2. **Verify:**
   - ✅ Confirmation dialog appears
   - ✅ Car is removed from list
   - ✅ Car is deleted from database

### 4. Service History Testing

#### Add Service Record

1. **Navigate to Service History**
   - Go to /dashboard/history

2. **Add Service:**
   ```
   Car: Select a car
   Service Type: Oil Change
   Date: Today's date
   Cost: 50000
   Mileage: 45000
   Notes: Regular maintenance
   ```

3. **Verify:**
   - ✅ Service record is created
   - ✅ Appears in service history
   - ✅ Associated with correct car

### 5. Reminders Testing

#### Add Reminder

1. **Navigate to Reminders**
   - Go to /dashboard/reminders/add

2. **Create Reminder:**
   ```
   Car: Select a car
   Service Type: Oil Change
   Due Date: 30 days from now
   Priority: High
   Notes: Regular maintenance reminder
   ```

3. **Verify:**
   - ✅ Reminder is created
   - ✅ Appears in reminders list
   - ✅ Shows in dashboard "Upcoming Reminders"

### 6. Mobile Experience Testing

#### Pull-to-Refresh

1. **On Mobile Device or Responsive Mode:**
   - Navigate to /dashboard/cars
   - Pull down from top of page
   - Release to refresh

2. **Verify:**
   - ✅ Refresh icon appears and rotates
   - ✅ Data refreshes
   - ✅ Success toast appears

#### Bottom Navigation

1. **On Mobile Device:**
   - Verify bottom navigation is visible
   - Tap each navigation item

2. **Verify:**
   - ✅ Active tab is highlighted
   - ✅ Navigation is smooth
   - ✅ Icons and labels are clear
   - ✅ Touch targets are at least 44x44px

#### Touch Feedback

1. **Test All Interactive Elements:**
   - Buttons
   - Cards
   - Navigation items

2. **Verify:**
   - ✅ Visual feedback on tap (scale/opacity change)
   - ✅ Ripple effect on buttons
   - ✅ Smooth animations

#### Safe Area Support (iOS)

1. **On iOS Device:**
   - Check top area (notch)
   - Check bottom area (home indicator)

2. **Verify:**
   - ✅ Content not hidden by notch
   - ✅ Bottom nav respects safe area
   - ✅ No content clipping

### 7. Subscription Testing

#### Trial Period

1. **New User:**
   - Register new account
   - Check dashboard

2. **Verify:**
   - ✅ Trial period shows 7 days
   - ✅ Trial expiration date is correct
   - ✅ Access is not restricted during trial

#### Subscription Payment

1. **Navigate to Subscription Page**
   - Go to /dashboard/subscription

2. **Submit Payment Proof:**
   - Select payment method (Tigo Pesa)
   - Enter transaction ID
   - Upload verification image

3. **Verify (Admin):**
   - ✅ Payment appears in admin panel
   - ✅ Admin can verify/reject payment
   - ✅ User status updates on verification

### 8. Responsive Design Testing

#### Test Breakpoints

1. **Desktop (≥1024px):**
   - ✅ Sidebar visible
   - ✅ Grid layouts show all columns
   - ✅ Images display properly

2. **Tablet (768px-1023px):**
   - ✅ Sidebar hidden, hamburger menu visible
   - ✅ 2-column grid layouts
   - ✅ Touch-friendly targets

3. **Mobile (<768px):**
   - ✅ Bottom navigation visible
   - ✅ Single column layouts
   - ✅ All text readable
   - ✅ Images scale properly

### 9. Performance Testing

#### Page Load Times

1. **Test Key Pages:**
   - Home page
   - Dashboard
   - Cars list
   - Login/Register

2. **Verify:**
   - ✅ Initial load < 3 seconds
   - ✅ Navigation feels instant
   - ✅ Images load progressively

#### Data Loading

1. **Monitor Network Tab:**
   - Check API calls
   - Verify caching

2. **Verify:**
   - ✅ Data loads efficiently
   - ✅ No unnecessary re-fetches
   - ✅ Loading states display properly

### 10. Error Handling Testing

#### Network Errors

1. **Simulate Offline:**
   - Turn off internet
   - Try to load data

2. **Verify:**
   - ✅ Graceful error messages
   - ✅ Retry mechanism available
   - ✅ Cached data displays

#### Validation Errors

1. **Test Form Validations:**
   - Submit empty forms
   - Submit invalid data

2. **Verify:**
   - ✅ Clear error messages
   - ✅ Field-level validation
   - ✅ Helpful hints

## Common Issues and Solutions

### Issue: Supabase Connection Error

**Solution:**
1. Verify `.env.local` file exists and has correct values
2. Check Supabase project is active
3. Verify API keys are not expired

### Issue: Authentication Not Persisting

**Solution:**
1. Check browser allows cookies
2. Verify localStorage is enabled
3. Clear browser cache and retry

### Issue: Database Policies Blocking Access

**Solution:**
1. Verify RLS policies are correctly set up
2. Check user_id matches auth.uid()
3. Review policy SQL in Supabase dashboard

### Issue: Mobile Layout Issues

**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check viewport meta tag in layout

### Issue: Images Not Loading

**Solution:**
1. Check Supabase Storage bucket exists
2. Verify storage policies allow public access
3. Check image URLs are correct

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database schema deployed to production
- [ ] Storage buckets created
- [ ] Authentication providers configured
- [ ] Error tracking set up (optional: Sentry)

### Deployment

- [ ] Build passes (`npm run build`)
- [ ] Deploy to hosting (Vercel recommended)
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate
- [ ] Configure environment variables on hosting

### Post-Deployment

- [ ] Test production authentication
- [ ] Verify database connections
- [ ] Check all routes accessible
- [ ] Test payment flow
- [ ] Monitor error logs
- [ ] Set up backups (Supabase auto-backups)

## Support and Maintenance

### Regular Checks

1. **Weekly:**
   - Monitor error logs
   - Check user registrations
   - Verify payment submissions

2. **Monthly:**
   - Review performance metrics
   - Update dependencies
   - Backup database (automatic with Supabase)

3. **Quarterly:**
   - Security audit
   - Performance optimization
   - Feature updates

### Getting Help

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Community:** Stack Overflow, GitHub Issues

---

**Last Updated:** October 2025
**Version:** 1.0

