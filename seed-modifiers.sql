-- Seed Modifier Groups and Modifiers for Coffee Products
-- Run this SQL in Supabase SQL Editor

-- Create modifier groups
INSERT INTO modifier_groups (name, required) VALUES
  ('Size', true),
  ('Milk Type', false),
  ('Sugar Level', false);

-- Get modifier group IDs (for reference)
-- Size modifiers
INSERT INTO modifiers (group_id, name, price_adjustment) VALUES
  ((SELECT id FROM modifier_groups WHERE name = 'Size'), 'Small', -5000),
  ((SELECT id FROM modifier_groups WHERE name = 'Size'), 'Medium', 0),
  ((SELECT id FROM modifier_groups WHERE name = 'Size'), 'Large', 5000);

-- Milk Type modifiers
INSERT INTO modifiers (group_id, name, price_adjustment) VALUES
  ((SELECT id FROM modifier_groups WHERE name = 'Milk Type'), 'Regular Milk', 0),
  ((SELECT id FROM modifier_groups WHERE name = 'Milk Type'), 'Oat Milk', 5000),
  ((SELECT id FROM modifier_groups WHERE name = 'Milk Type'), 'Almond Milk', 5000),
  ((SELECT id FROM modifier_groups WHERE name = 'Milk Type'), 'Soy Milk', 3000);

-- Sugar Level modifiers
INSERT INTO modifiers (group_id, name, price_adjustment) VALUES
  ((SELECT id FROM modifier_groups WHERE name = 'Sugar Level'), 'No Sugar', 0),
  ((SELECT id FROM modifier_groups WHERE name = 'Sugar Level'), 'Less Sugar', 0),
  ((SELECT id FROM modifier_groups WHERE name = 'Sugar Level'), 'Normal Sugar', 0),
  ((SELECT id FROM modifier_groups WHERE name = 'Sugar Level'), 'Extra Sugar', 0);

-- Link Coffee products to modifier groups
-- Get all coffee products and link them to Size and Milk Type
INSERT INTO product_modifiers (product_id, modifier_group_id)
SELECT p.id, mg.id
FROM products p
CROSS JOIN modifier_groups mg
WHERE p.category_id = (SELECT id FROM categories WHERE name = 'Coffee')
  AND mg.name IN ('Size', 'Milk Type', 'Sugar Level');

-- Verification query
SELECT 
  p.name AS product,
  mg.name AS modifier_group,
  m.name AS modifier,
  m.price_adjustment
FROM products p
JOIN product_modifiers pm ON p.id = pm.product_id
JOIN modifier_groups mg ON pm.modifier_group_id = mg.id
JOIN modifiers m ON m.group_id = mg.id
WHERE p.category_id = (SELECT id FROM categories WHERE name = 'Coffee')
ORDER BY p.name, mg.name, m.name;
