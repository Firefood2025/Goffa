/*
  # Create notifications table

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
*/

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL, 
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own notifications
CREATE POLICY "Users can view their own notifications" 
ON notifications FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to insert their own notifications
CREATE POLICY "Users can insert their own notifications" 
ON notifications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own notifications
CREATE POLICY "Users can update their own notifications" 
ON notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own notifications
CREATE POLICY "Users can delete their own notifications" 
ON notifications FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster notification retrieval
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);