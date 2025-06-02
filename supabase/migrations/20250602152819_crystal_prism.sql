/*
  # Shopping List and Family Members Tables

  1. New Tables
    - `shopping_list`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `quantity` (numeric, default 1)
      - `unit` (text, default 'pc')
      - `category` (text, default 'General')
      - `ischecked` (boolean, default false)
      - `note` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)
      - `shared_with` (uuid array)
    
    - `family_members`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
    - Add unique constraint on family members email per user

  3. Performance
    - Add indexes for frequently queried columns
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop shopping list policies
  BEGIN
    DROP POLICY IF EXISTS "Users can manage their own shopping list items" ON shopping_list;
  EXCEPTION
    WHEN undefined_object THEN
      NULL;
  END;
  
  -- Drop family members policies
  BEGIN
    DROP POLICY IF EXISTS "Users can manage their own family members" ON family_members;
  EXCEPTION
    WHEN undefined_object THEN
      NULL;
  END;
END $$;

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
DO $$
BEGIN
  -- Create shopping list index
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_shopping_list_user_id'
  ) THEN
    CREATE INDEX idx_shopping_list_user_id ON shopping_list(user_id);
  END IF;

  -- Create family members indexes
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_family_members_user_id'
  ) THEN
    CREATE INDEX idx_family_members_user_id ON family_members(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_family_members_email'
  ) THEN
    CREATE INDEX idx_family_members_email ON family_members(email);
  END IF;
END $$;