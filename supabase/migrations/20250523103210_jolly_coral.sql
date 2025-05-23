/*
  # Fix notifications table and RLS policies

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `message` (text)
      - `type` (text, default 'info')
      - `read` (boolean, default false)
      - `action_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on notifications table
    - Add policies for users to manage their own notifications

  3. Performance
    - Add indexes for user_id and read status
*/

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS if not already enabled
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;

-- Create new policy for users to manage their own notifications
CREATE POLICY "Users can manage their own notifications"
  ON notifications
  FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);