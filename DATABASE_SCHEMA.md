# Database Schema for Gari Langu

## Overview
This document describes the database schema required for the Gari Langu car management system. The application uses Supabase (PostgreSQL) as its database.

## Tables

### 1. users
Stores user profiles and subscription information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_subscribed BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Admins can read all users
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

### 2. cars
Stores vehicle information for each user.

```sql
CREATE TABLE cars (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year TEXT NOT NULL,
  license_plate TEXT NOT NULL,
  color TEXT,
  vin TEXT,
  image TEXT,
  description TEXT
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own cars
CREATE POLICY "Users can read own cars" ON cars
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own cars
CREATE POLICY "Users can insert own cars" ON cars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own cars
CREATE POLICY "Users can update own cars" ON cars
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own cars
CREATE POLICY "Users can delete own cars" ON cars
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. services
Stores service history for each car.

```sql
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  cost TEXT,
  mileage TEXT,
  notes TEXT,
  from_reminder BOOLEAN DEFAULT FALSE,
  reminder_id UUID
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own services
CREATE POLICY "Users can read own services" ON services
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own services
CREATE POLICY "Users can insert own services" ON services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own services
CREATE POLICY "Users can update own services" ON services
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own services
CREATE POLICY "Users can delete own services" ON services
  FOR DELETE USING (auth.uid() = user_id);
```

### 4. reminders
Stores service reminders for each car.

```sql
CREATE TABLE reminders (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  notes TEXT,
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_types TEXT,
  notification_schedule TEXT,
  completed_date TIMESTAMP WITH TIME ZONE,
  added_to_service_history BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own reminders
CREATE POLICY "Users can read own reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own reminders
CREATE POLICY "Users can insert own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reminders
CREATE POLICY "Users can update own reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own reminders
CREATE POLICY "Users can delete own reminders" ON reminders
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. payments
Stores payment records for subscriptions.

```sql
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL,
  user_id BIGINT NOT NULL,
  method TEXT,
  months TEXT,
  status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  verification_message TEXT,
  verification_image TEXT,
  amount TEXT,
  admin_notes TEXT
);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own payments
CREATE POLICY "Users can read own payments" ON payments
  FOR SELECT USING (
    user_id::TEXT = auth.uid()::TEXT OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy: Users can insert their own payments
CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (user_id::TEXT = auth.uid()::TEXT);

-- Policy: Admins can update payments
CREATE POLICY "Admins can update payments" ON payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

### 6. notifications (optional)
Stores system notifications for users.

```sql
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  link TEXT
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
```

## Setup Instructions

1. **Create a Supabase Project**
   - Go to https://supabase.com/dashboard
   - Create a new project
   - Wait for the project to be ready

2. **Run SQL Scripts**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste each table creation script above
   - Run them in order

3. **Enable Realtime (Optional)**
   - Go to Database > Replication
   - Enable realtime for tables you want to sync in real-time

4. **Configure Authentication**
   - Go to Authentication > Settings
   - Enable Email authentication
   - Configure email templates as needed
   - (Optional) Enable Google OAuth if desired

5. **Get API Keys**
   - Go to Project Settings > API
   - Copy the Project URL and anon/public key
   - Add them to your `.env.local` file

## Indexes for Performance

```sql
-- Index for faster user lookups
CREATE INDEX idx_users_email ON users(email);

-- Index for faster car lookups by user
CREATE INDEX idx_cars_user_id ON cars(user_id);

-- Index for faster service lookups
CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_services_car_id ON services(car_id);
CREATE INDEX idx_services_date ON services(date DESC);

-- Index for faster reminder lookups
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_car_id ON reminders(car_id);
CREATE INDEX idx_reminders_due_date ON reminders(due_date);
CREATE INDEX idx_reminders_status ON reminders(status);

-- Index for faster payment lookups
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
```

## Storage Setup (for car images)

1. Go to Storage in Supabase dashboard
2. Create a new bucket called `car-images`
3. Set it to public or configure appropriate policies
4. Update bucket policies:

```sql
-- Policy: Users can upload their own images
CREATE POLICY "Users can upload own images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'car-images' AND
    auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Policy: Anyone can view images
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-images');
```

## Notes

- All timestamps are stored in UTC
- User IDs reference the Supabase Auth `auth.users` table
- Row Level Security (RLS) is enabled on all tables for security
- The `payments.user_id` is stored as BIGINT for compatibility with older data
- Make sure to adjust policies based on your specific security requirements

