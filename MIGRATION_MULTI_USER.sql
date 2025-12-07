-- MIGRATION: Single-Tenant to Multi-Tenant (User Isolation)
-- Run this script in Supabase SQL Editor

-- 1. Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 2. Categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
DROP POLICY IF EXISTS "Users can manage their own categories" ON categories;
CREATE POLICY "Users can manage their own categories" ON categories
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3. Products
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
DROP POLICY IF EXISTS "Users can manage their own products" ON products;
CREATE POLICY "Users can manage their own products" ON products
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 4. Modifier Groups
ALTER TABLE modifier_groups ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
DROP POLICY IF EXISTS "Users can manage their own modifier groups" ON modifier_groups;
CREATE POLICY "Users can manage their own modifier groups" ON modifier_groups
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 5. Modifiers
ALTER TABLE modifiers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
DROP POLICY IF EXISTS "Users can manage their own modifiers" ON modifiers;
CREATE POLICY "Users can manage their own modifiers" ON modifiers
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 6. Product Modifiers (Link Table)
ALTER TABLE product_modifiers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
DROP POLICY IF EXISTS "Users can manage their own product modifiers" ON product_modifiers;
CREATE POLICY "Users can manage their own product modifiers" ON product_modifiers
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 7. Orders
-- Check if user_id exists first (it was in original schema but might be nullable)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='user_id') THEN
    ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
  ELSE
    ALTER TABLE orders ALTER COLUMN user_id SET DEFAULT auth.uid();
  END IF;
END $$;

DROP POLICY IF EXISTS "Users can manage their own orders" ON orders;
CREATE POLICY "Users can manage their own orders" ON orders
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 8. Order Items
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
DROP POLICY IF EXISTS "Users can manage their own order items" ON order_items;
CREATE POLICY "Users can manage their own order items" ON order_items
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 9. Settings
-- Settings table already has user_id
DROP POLICY IF EXISTS "Users can manage their own settings" ON settings;
CREATE POLICY "Users can manage their own settings" ON settings
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 10. Fix existing data (Optional: Assign orphan data to a specific user if needed)
-- UPDATE categories SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
