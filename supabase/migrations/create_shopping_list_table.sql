
CREATE TABLE IF NOT EXISTS shopping_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'pc',
  category TEXT NOT NULL DEFAULT 'General',
  isChecked BOOLEAN NOT NULL DEFAULT FALSE,
  note TEXT,
  added_date TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Optional: Add Row Level Security (RLS)
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own shopping list items" 
ON shopping_list 
FOR ALL 
USING (auth.uid() = user_id);

-- Create family members table
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (email, user_id)
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own family members" 
ON family_members 
FOR ALL 
USING (auth.uid() = user_id);
