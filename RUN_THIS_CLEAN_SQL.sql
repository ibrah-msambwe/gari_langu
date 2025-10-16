-- ================================================================
-- GARI LANGU - COMPLETE DATABASE SETUP (CLEAN VERSION)
-- Run this in Supabase SQL Editor
-- ================================================================

-- ================================================================
-- STEP 1: DROP EXISTING POLICIES (if they exist)
-- ================================================================
DROP POLICY IF EXISTS "Users can read own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can insert own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can update own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can delete own reminders" ON reminders;

DROP POLICY IF EXISTS "Users can read own services" ON services;
DROP POLICY IF EXISTS "Users can insert own services" ON services;
DROP POLICY IF EXISTS "Users can update own services" ON services;
DROP POLICY IF EXISTS "Users can delete own services" ON services;

DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;

-- ================================================================
-- STEP 2: DROP AND RECREATE TABLES
-- ================================================================

-- Drop tables in correct order (dependencies)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reminders CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- ================================================================
-- STEP 3: CREATE REMINDERS TABLE
-- ================================================================
CREATE TABLE reminders (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  notes TEXT NOT NULL DEFAULT '',
  notification_sent BOOLEAN NOT NULL DEFAULT FALSE,
  notification_types TEXT NOT NULL DEFAULT 'email',
  notification_schedule TEXT NOT NULL DEFAULT '1 week before',
  added_to_service_history BOOLEAN NOT NULL DEFAULT FALSE,
  completed_date TIMESTAMP WITH TIME ZONE
);

-- ================================================================
-- STEP 4: CREATE SERVICES TABLE
-- ================================================================
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  cost NUMERIC(10,2) DEFAULT 0,
  mileage INTEGER DEFAULT 0,
  description TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  from_reminder BOOLEAN DEFAULT FALSE,
  reminder_id TEXT
);

-- ================================================================
-- STEP 5: CREATE NOTIFICATIONS TABLE
-- ================================================================
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  priority TEXT NOT NULL DEFAULT 'medium',
  recipient_type TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'unread',
  read_at TIMESTAMP WITH TIME ZONE
);

-- ================================================================
-- STEP 6: ENABLE ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- STEP 7: CREATE POLICIES FOR REMINDERS
-- ================================================================
CREATE POLICY "Users can read own reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON reminders
  FOR DELETE USING (auth.uid() = user_id);

-- ================================================================
-- STEP 8: CREATE POLICIES FOR SERVICES
-- ================================================================
CREATE POLICY "Users can read own services" ON services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own services" ON services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own services" ON services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own services" ON services
  FOR DELETE USING (auth.uid() = user_id);

-- ================================================================
-- STEP 9: CREATE POLICIES FOR NOTIFICATIONS
-- ================================================================
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- ================================================================
-- STEP 10: CREATE INDEXES FOR PERFORMANCE
-- ================================================================

-- Reminders indexes
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_car_id ON reminders(car_id);
CREATE INDEX idx_reminders_due_date ON reminders(due_date ASC);
CREATE INDEX idx_reminders_status ON reminders(status);
CREATE INDEX idx_reminders_user_status ON reminders(user_id, status);
CREATE INDEX idx_reminders_pending ON reminders(due_date, status) WHERE notification_sent = false AND status = 'pending';

-- Services indexes
CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_services_car_id ON services(car_id);
CREATE INDEX idx_services_date ON services(date DESC);
CREATE INDEX idx_services_user_car ON services(user_id, car_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ================================================================
-- SUCCESS! All tables created with correct schema
-- ================================================================

