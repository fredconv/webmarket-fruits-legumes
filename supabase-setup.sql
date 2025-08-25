-- Create vendors table
CREATE TABLE vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data (optional)
INSERT INTO vendors (name, location, contact_email) VALUES
  ('Fresh Farm Produce', 'Downtown Market, Main St', 'contact@freshfarm.com'),
  ('Green Valley Organics', 'Farmers Market, 5th Avenue', 'info@greenvalley.org'),
  ('Sunny Acres Farm', 'Riverside District', 'hello@sunnyacres.com');

-- Enable RLS (Row Level Security) - optional but recommended
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (you can modify these based on your needs)
CREATE POLICY "Enable read access for all users" ON vendors
  FOR SELECT USING (true);

-- If you want to allow authenticated users to create/update vendors
CREATE POLICY "Enable insert for authenticated users only" ON vendors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON vendors
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON vendors
  FOR DELETE USING (auth.role() = 'authenticated');
