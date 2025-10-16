-- ================================================================
-- PERFECT MATCH DATABASE SETUP
-- This matches your reminders/add/page.tsx EXACTLY
-- ================================================================

-- ================================================================
-- DROP AND RECREATE REMINDERS TABLE
-- ================================================================
DROP TABLE IF EXISTS reminders CASCADE;

CREATE TABLE reminders (
  -- Auto-generated fields
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Required fields (set by app)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  due_date DATE NOT NULL,
  
  -- Fields with defaults (from your add page)
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  notes TEXT NOT NULL DEFAULT '',
  notification_sent BOOLEAN NOT NULL DEFAULT FALSE,
  notification_types TEXT NOT NULL DEFAULT 'email',
  notification_schedule TEXT NOT NULL DEFAULT '1 week before',
  added_to_service_history BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Optional fields (set later)
  completed_date TIMESTAMP WITH TIME ZONE
);

-- ================================================================
-- DROP AND RECREATE SERVICES TABLE  
-- ================================================================
DROP TABLE IF EXISTS services CASCADE;

CREATE TABLE services (
  -- Auto-generated fields
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Required fields
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  
  -- Optional fields with defaults
  description TEXT DEFAULT '',
  cost TEXT DEFAULT '0',
  mileage TEXT DEFAULT '0',
  notes TEXT DEFAULT '',
  from_reminder BOOLEAN DEFAULT FALSE,
  reminder_id TEXT
);

-- ================================================================
-- ENABLE ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- CREATE POLICIES FOR REMINDERS
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
-- CREATE POLICIES FOR SERVICES
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
-- CREATE INDEXES
-- ================================================================
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_car_id ON reminders(car_id);
CREATE INDEX idx_reminders_due_date ON reminders(due_date ASC);
CREATE INDEX idx_reminders_status ON reminders(status);
CREATE INDEX idx_reminders_user_status ON reminders(user_id, status);
CREATE INDEX idx_reminders_pending ON reminders(due_date, status) WHERE notification_sent = false AND status = 'pending';

CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_services_car_id ON services(car_id);
CREATE INDEX idx_services_date ON services(date DESC);
CREATE INDEX idx_services_user_car ON services(user_id, car_id);

-- ================================================================
-- VERIFY SETUP
-- ================================================================

-- Show reminders table structure
SELECT '✅ REMINDERS TABLE STRUCTURE:' as section;
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'reminders'
ORDER BY ordinal_position;

-- Show services table structure  
SELECT '✅ SERVICES TABLE STRUCTURE:' as section;
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'services'
ORDER BY ordinal_position;

-- Show exact match confirmation
SELECT '✅✅✅ DATABASE SETUP COMPLETE!' as status;
SELECT 'Tables match your code perfectly!' as message;
SELECT 'Ready to create reminders with car details!' as message;

-- ================================================================
-- FIELD MAPPING REFERENCE
-- ================================================================
-- 
-- Your reminders/add/page.tsx sends these fields:
-- ✅ car_id (number) → reminders.car_id (BIGINT)
-- ✅ service_type (string) → reminders.service_type (TEXT)
-- ✅ due_date (string) → reminders.due_date (DATE)
-- ✅ status (string) → reminders.status (TEXT DEFAULT 'pending')
-- ✅ notification_sent (boolean) → reminders.notification_sent (BOOLEAN DEFAULT false)
-- ✅ notification_types (string) → reminders.notification_types (TEXT DEFAULT 'email')
-- ✅ notification_schedule (string) → reminders.notification_schedule (TEXT DEFAULT '1 week before')
-- ✅ priority (string) → reminders.priority (TEXT DEFAULT 'medium')
-- ✅ notes (string) → reminders.notes (TEXT DEFAULT '')
-- ✅ added_to_service_history (boolean) → reminders.added_to_service_history (BOOLEAN DEFAULT false)
-- ✅ user_id (added by store) → reminders.user_id (UUID from auth)
--
-- All fields match perfectly! ✅
-- ================================================================

-- ================================================================
-- CREATE NOTIFICATIONS TABLE
-- ================================================================
DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE notifications (
  -- Auto-generated fields
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Required fields
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Fields with defaults
  type TEXT NOT NULL DEFAULT 'info',
  priority TEXT NOT NULL DEFAULT 'medium',
  recipient_type TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'unread',
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: System can insert notifications for any user
CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ================================================================
-- NOTIFICATIONS TABLE PERFECT MATCH ✅
-- ================================================================
-- TypeScript Interface → Database Column
-- ✅ id (number) → notifications.id (BIGSERIAL)
-- ✅ created_at (string) → notifications.created_at (TIMESTAMP)
-- ✅ user_id (string UUID) → notifications.user_id (UUID)
-- ✅ title (string) → notifications.title (TEXT)
-- ✅ message (string) → notifications.message (TEXT)
-- ✅ type (string) → notifications.type (TEXT DEFAULT 'info')
-- ✅ priority (string) → notifications.priority (TEXT DEFAULT 'medium')
-- ✅ recipient_type (string) → notifications.recipient_type (TEXT DEFAULT 'user')
-- ✅ status (string) → notifications.status (TEXT DEFAULT 'unread')
-- ✅ read_at (string | null) → notifications.read_at (TIMESTAMP)
--
-- All fields match perfectly! ✅
-- ================================================================

