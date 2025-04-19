
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT,
  category TEXT,
  expiry_date TIMESTAMPTZ,
  added_date TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Optional: Add Row Level Security (RLS)
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own pantry items" 
ON pantry_items 
FOR ALL 
USING (auth.uid() = user_id);
