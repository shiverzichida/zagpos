# Modifier Data - SQL Seed Script

Jalankan SQL berikut di Supabase SQL Editor untuk menambahkan modifier data (Size, Milk Type, Sugar Level):

```sql
-- Modifier Groups
INSERT INTO modifier_groups (name, required) VALUES
  ('Size', true),
  ('Milk Type', false),
  ('Sugar Level', false);

-- Size Modifiers
INSERT INTO modifiers (group_id, name, price_adjustment) VALUES
  ((SELECT id FROM modifier_groups WHERE name = 'Size'), 'Small', -3000),
  ((SELECT id FROM modifier_groups WHERE name = 'Size'), 'Medium', 0),
  ((SELECT id FROM modifier_groups WHERE name = 'Size'), 'Large', 5000);

-- Milk Type Modifiers
INSERT INTO modifiers (group_id, name, price_adjustment) VALUES
  ((SELECT id FROM modifier_groups WHERE name = 'Milk Type'), 'Dairy', 0),
  ((SELECT id FROM modifier_groups WHERE name = 'Milk Type'), 'Oat Milk', 8000),
  ((SELECT id FROM modifier_groups WHERE name = 'Milk Type'), 'Almond Milk', 8000),
  ((SELECT id FROM modifier_groups WHERE name = 'Milk Type'), 'Soy Milk', 5000);

-- Sugar Level Modifiers
INSERT INTO modifiers (group_id, name, price_adjustment) VALUES
  ((SELECT id FROM modifier_groups WHERE name = 'Sugar Level'), 'No Sugar', 0),
  ((SELECT id FROM modifier_groups WHERE name = 'Sugar Level'), 'Less Sugar', 0),
  ((SELECT id FROM modifier_groups WHERE name = 'Sugar Level'), 'Normal', 0),
  ((SELECT id FROM modifier_groups WHERE name = 'Sugar Level'), 'Extra Sweet', 2000);

-- Link modifiers to Coffee products
-- Get all coffee product IDs
DO $$
DECLARE
  coffee_category_id UUID;
  size_group_id UUID;
  milk_group_id UUID;
  sugar_group_id UUID;
  product_record RECORD;
BEGIN
  -- Get IDs
  SELECT id INTO coffee_category_id FROM categories WHERE name = 'Coffee';
  SELECT id INTO size_group_id FROM modifier_groups WHERE name = 'Size';
  SELECT id INTO milk_group_id FROM modifier_groups WHERE name = 'Milk Type';
  SELECT id INTO sugar_group_id FROM modifier_groups WHERE name = 'Sugar Level';
  
  -- Link modifiers to all coffee products
  FOR product_record IN 
    SELECT id FROM products WHERE category_id = coffee_category_id
  LOOP
    -- Add Size modifier group
    INSERT INTO product_modifiers (product_id, modifier_group_id) 
    VALUES (product_record.id, size_group_id)
    ON CONFLICT DO NOTHING;
    
    -- Add Milk Type modifier group
    INSERT INTO product_modifiers (product_id, modifier_group_id) 
    VALUES (product_record.id, milk_group_id)
    ON CONFLICT DO NOTHING;
    
    -- Add Sugar Level modifier group
    INSERT INTO product_modifiers (product_id, modifier_group_id) 
    VALUES (product_record.id, sugar_group_id)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
```

## Penjelasan:

1. **Modifier Groups** (3 grup):
   - Size (required) - wajib dipilih
   - Milk Type (optional)
   - Sugar Level (optional)

2. **Modifiers**:
   - Size: Small (-Rp3,000), Medium (Rp0), Large (+Rp5,000)
   - Milk Type: Dairy (Rp0), Oat Milk (+Rp8,000), Almond Milk (+Rp8,000), Soy Milk (+Rp5,000)
   - Sugar Level: No Sugar (Rp0), Less Sugar (Rp0), Normal (Rp0), Extra Sweet (+Rp2,000)

3. **Product Modifiers**: Semua produk Coffee akan punya 3 modifier groups ini

Setelah menjalankan SQL ini, ketika Anda klik produk Coffee di Sales page, akan muncul modal untuk memilih Size, Milk Type, dan Sugar Level.
