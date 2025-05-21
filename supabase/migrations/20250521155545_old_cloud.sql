/*
  # Add Notifications Table

  1. New Table
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text, required)
      - `message` (text, required)
      - `type` (text, default 'info')
      - `read` (boolean, default false)
      - `action_url` (text, optional)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS
    - Add policy for users to view their own notifications

  3. Performance
    - Add indexes for user_id and read status
*/

-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS notifications CASCADE;

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;

-- Create policy for users to manage their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);