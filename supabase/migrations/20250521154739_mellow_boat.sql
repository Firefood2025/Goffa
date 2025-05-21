/*
  # Enhanced Schema for Chef Booking and Notifications

  1. New Tables
    - `chef_bookings`
      - `id` (uuid, primary key)
      - `chef_id` (text, required)
      - `user_id` (uuid, references auth.users)
      - `booking_date` (date, required)
      - `booking_time` (time, required)
      - `status` (text, default 'pending')
      - `include_groceries` (boolean, default false)
      - `total_amount` (numeric, required)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text, required)
      - `message` (text, required)
      - `type` (text, default 'info')
      - `read` (boolean, default false)
      - `created_at` (timestamptz, default now())

  2. Enhancements to Existing Tables
    - Add `image_url` to pantry_items
    - Add `expiry_notification` to pantry_items
    - Add `shared_with` array to shopping_list

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Create chef_bookings table
CREATE TABLE IF NOT EXISTS chef_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chef_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  include_groceries BOOLEAN DEFAULT false,
  total_amount NUMERIC NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on chef_bookings
ALTER TABLE chef_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for chef_bookings
CREATE POLICY "Users can manage their own bookings"
ON chef_bookings
FOR ALL
USING (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for notifications
CREATE POLICY "Users can view their own notifications"
ON notifications
FOR ALL
USING (auth.uid() = user_id);

-- Add image_url to pantry_items if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pantry_items' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE pantry_items ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- Add expiry_notification to pantry_items if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pantry_items' AND column_name = 'expiry_notification'
  ) THEN
    ALTER TABLE pantry_items ADD COLUMN expiry_notification BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add shared_with array to shopping_list if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shopping_list' AND column_name = 'shared_with'
  ) THEN
    ALTER TABLE shopping_list ADD COLUMN shared_with UUID[] DEFAULT '{}';
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for chef_bookings
CREATE TRIGGER update_chef_bookings_updated_at
    BEFORE UPDATE ON chef_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chef_bookings_user_id ON chef_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_pantry_items_expiry_date ON pantry_items(expiry_date)
  WHERE expiry_date IS NOT NULL;