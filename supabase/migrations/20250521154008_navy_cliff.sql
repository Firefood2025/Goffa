/*
  # Shopping List and Family Members Schema

  1. New Tables
    - `shopping_list`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `quantity` (numeric, default 1)
      - `unit` (text, default 'pc')
      - `category` (text, default 'General')
      - `ischecked` (boolean, default false)
      - `note` (text, optional)
      - `created_at` (timestamptz, default now())
      - `user_id` (uuid, references auth.users)
    
    - `family_members`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz, default now())
      - Unique constraint on (email, user_id)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Drop existing tables if they exist to ensure clean state
DROP TABLE IF EXISTS shopping_list CASCADE;
DROP TABLE IF EXISTS family_members CASCADE;

-- Create shopping list table
CREATE TABLE shopping_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'pc',
  category TEXT NOT NULL DEFAULT 'General',
  ischecked BOOLEAN NOT NULL DEFAULT FALSE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on shopping list
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own shopping list items" ON shopping_list;

-- Create new policy for shopping list
CREATE POLICY "Users can manage their own shopping list items" 
ON shopping_list 
FOR ALL 
USING (auth.uid() = user_id);

-- Create family members table
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (email, user_id)
);

-- Enable RLS on family members
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own family members" ON family_members;

-- Create new policy for family members
CREATE POLICY "Users can manage their own family members" 
ON family_members 
FOR ALL 
USING (auth.uid() = user_id);