/*
  # Create shopping list table with RLS policies

  1. New Tables
    - `shopping_list`
      - `id` (uuid, primary key)
      - `name` (text)
      - `quantity` (numeric, default 1)
      - `unit` (text, default 'pc')
      - `category` (text, default 'General')
      - `ischecked` (boolean, default false)
      - `note` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS
    - Add policies for users to manage their own shopping list items
*/

-- Create shopping list table
CREATE TABLE IF NOT EXISTS shopping_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit TEXT DEFAULT 'pc',
  category TEXT DEFAULT 'General',
  ischecked BOOLEAN DEFAULT FALSE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own shopping list items
CREATE POLICY "Users can manage their own shopping list items"
  ON shopping_list
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_shopping_list_user_id ON shopping_list(user_id);