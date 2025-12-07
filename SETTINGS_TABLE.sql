-- Create settings table untuk menyimpan user preferences
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT DEFAULT 'My Store',
  currency TEXT DEFAULT 'IDR',
  theme TEXT DEFAULT 'dark',
  auto_print BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings (untuk demo tanpa auth)
INSERT INTO settings (store_name, currency, theme, auto_print)
VALUES ('POS Ristro Store', 'IDR', 'dark', false)
ON CONFLICT DO NOTHING;

-- Create function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
