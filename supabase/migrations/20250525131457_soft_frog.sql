/*
  # Fix Shopping List RLS Policy

  1. Changes
    - Enable RLS on shopping_list table
    - Add proper RLS policy for authenticated users
    - Add policy for shared list access
  
  2. Security
    - Users can only access their own shopping lists
    - Users can access lists shared with them
    - RLS enabled by default
*/

-- Enable RLS
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own shopping list items" ON shopping_list;

-- Create new policy for shopping list access
CREATE POLICY "Users can manage their own shopping list items"
ON shopping_list
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id OR 
  auth.uid() = ANY(shared_with)
)
WITH CHECK (
  auth.uid() = user_id OR 
  auth.uid() = ANY(shared_with)
);