-- Insert vendors with mock data
INSERT INTO vendors (name, location, contact_email) VALUES
  ('Ferme des Trois Chênes', 'Brussels, Belgium', 'contact@fermetroischenes.be'),
  ('BioMarkt Van Houten', 'Antwerp, Belgium', 'info@biomarktvanhouten.be'),
  ('La Ferme du Soleil', 'Liège, Belgium', 'hello@fermedusoleil.be'),
  ('Organic Valley Farm', 'Ghent, Belgium', 'contact@organicvalley.be'),
  ('De Groene Akker', 'Leuven, Belgium', 'info@groeneakker.be'),
  ('Fromagerie Artisanale', 'Namur, Belgium', 'cheese@artisanalefromagerie.be'),
  ('Boucherie Traditionnelle', 'Charleroi, Belgium', 'viande@boucherietrad.be'),
  ('Les Ruches du Brabant', 'Waterloo, Belgium', 'miel@ruchesdubrabant.be'),
  ('Distillerie des Collines', 'Dinant, Belgium', 'spirits@distilleriecollines.be'),
  ('Marché Bio Central', 'Mons, Belgium', 'contact@marchebiocentral.be'),
  ('Ferme Avicole Delhaize', 'Tournai, Belgium', 'oeufs@fermeavicole.be'),
  ('Brasserie du Terroir', 'Mechelen, Belgium', 'biere@brasserieduterroir.be');

-- Create vendor-product associations
-- First, let's get some vendor IDs and product IDs to work with

-- Ferme des Trois Chênes - Fruits and Vegetables specialist
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'Ferme des Trois Chênes'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  JOIN categories c ON s.category_id = c.id
  WHERE c.name = 'Fruits and Vegetables'
  AND p.name IN ('apples', 'pears', 'strawberries', 'carrots', 'potatoes', 'tomatoes', 'lettuce', 'onions')
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- BioMarkt Van Houten - Organic everything
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'BioMarkt Van Houten'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  JOIN categories c ON s.category_id = c.id
  WHERE p.name IN ('apples', 'carrots', 'milk', 'yogurts', 'artisanal bread', 'honey', 'fruit juice')
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- La Ferme du Soleil - Dairy and seasonal fruits
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'La Ferme du Soleil'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  JOIN categories c ON s.category_id = c.id
  WHERE p.name IN ('milk', 'yogurts', 'butter', 'cream', 'fresh chicken eggs', 'strawberries', 'raspberries', 'cherries')
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- Organic Valley Farm - Premium organic vegetables
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'Organic Valley Farm'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  JOIN categories c ON s.category_id = c.id
  WHERE p.name IN ('carrots', 'potatoes', 'tomatoes', 'lettuce', 'zucchini', 'onions', 'vegetable juice', 'vegetable preserves')
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- De Groene Akker - Local vegetables and grains
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'De Groene Akker'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  JOIN categories c ON s.category_id = c.id
  WHERE p.name IN ('potatoes', 'carrots', 'onions', 'artisanal bread', 'flour', 'pasta', 'vegetable preserves')
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- Fromagerie Artisanale - Cheese specialist
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'Fromagerie Artisanale'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  JOIN categories c ON s.category_id = c.id
  WHERE p.name IN ('cheeses', 'milk', 'butter', 'cream', 'yogurts')
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- Boucherie Traditionnelle - Meat specialist
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'Boucherie Traditionnelle'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  JOIN categories c ON s.category_id = c.id
  WHERE c.name = 'Meats and Poultry'
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- Les Ruches du Brabant - Bee products specialist
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'Les Ruches du Brabant'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  WHERE s.type = 'Bee Products'
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- Distillerie des Collines - Beverages specialist
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'Distillerie des Collines'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  JOIN categories c ON s.category_id = c.id
  WHERE c.name = 'Beverages'
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- Marché Bio Central - Mixed organic products
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'Marché Bio Central'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  JOIN categories c ON s.category_id = c.id
  WHERE p.name IN ('apples', 'pears', 'carrots', 'milk', 'cheeses', 'artisanal bread', 'honey', 'fruit jam', 'fruit juice')
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- Ferme Avicole Delhaize - Poultry and eggs specialist
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'Ferme Avicole Delhaize'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  WHERE s.type IN ('Poultry', 'Eggs')
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- Brasserie du Terroir - Craft beverages and preserves
WITH vendor_ref AS (
  SELECT id FROM vendors WHERE name = 'Brasserie du Terroir'
),
product_refs AS (
  SELECT p.id, p.name
  FROM products p
  JOIN subcategories s ON p.subcategory_id = s.id
  JOIN categories c ON s.category_id = c.id
  WHERE p.name IN ('craft beer', 'cider', 'non-alcoholic cider', 'syrups', 'fruit jam')
)
INSERT INTO vendor_products (vendor_id, product_id)
SELECT v.id, p.id
FROM vendor_ref v
CROSS JOIN product_refs p;

-- Now let's also populate vendor_categories for easier filtering
-- This will derive categories from the products each vendor sells

-- Populate vendor_categories based on vendor_products
INSERT INTO vendor_categories (vendor_id, category_id)
SELECT DISTINCT vp.vendor_id, c.id
FROM vendor_products vp
JOIN products p ON vp.product_id = p.id
JOIN subcategories s ON p.subcategory_id = s.id
JOIN categories c ON s.category_id = c.id
ON CONFLICT (vendor_id, category_id) DO NOTHING;

-- Populate vendor_subcategories based on vendor_products
INSERT INTO vendor_subcategories (vendor_id, subcategory_id)
SELECT DISTINCT vp.vendor_id, s.id
FROM vendor_products vp
JOIN products p ON vp.product_id = p.id
JOIN subcategories s ON p.subcategory_id = s.id
ON CONFLICT (vendor_id, subcategory_id) DO NOTHING;
