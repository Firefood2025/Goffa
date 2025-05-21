/*
  # Shopping List and Family Members Schema

  1. New Tables
    - `shopping_list`
      - `id` (uuid, primary key)
      - `name` (text)
      - `quantity` (numeric)
      - `unit` (text)
      - `category` (text)
      - `ischecked` (boolean)
      - `note` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid)
      - `shared_with` (uuid[])
    
    - `family_members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `user_id` (uuid)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
    - Add indexes for performance
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own shopping list items" ON shopping_list;
DROP POLICY IF EXISTS "Users can manage their own family members" ON family_members;

-- Create shopping list table
CREATE TABLE IF NOT EXISTS shopping_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quantity numeric DEFAULT 1,
  unit text DEFAULT 'pc',
  category text DEFAULT 'General',
  ischecked boolean DEFAULT false,
  note text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  shared_with uuid[] DEFAULT '{}'::uuid[]
);

-- Enable RLS for shopping list
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

-- Create policy for shopping list
CREATE POLICY "Users can manage their own shopping list items"
  ON shopping_list
  FOR ALL
  USING (
    auth.uid() = user_id OR 
    auth.uid() = ANY(shared_with)
  );

-- Create family members table
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(email, user_id)
);

-- Enable RLS for family members
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Create policy for family members
CREATE POLICY "Users can manage their own family members"
  ON family_members
  FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shopping_list_user_id ON shopping_list(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_email ON family_members(email);