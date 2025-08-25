-- Insert categories with translations
INSERT INTO categories (name, name_fr, name_nl) VALUES
  ('Fruits and Vegetables', 'Fruits et Légumes', 'Fruit en Groenten'),
  ('Dairy and Eggs', 'Produits Laitiers et Œufs', 'Zuivel en Eieren'),
  ('Meats and Poultry', 'Viandes et Volailles', 'Vlees en Gevogelte'),
  ('Processed Foods and Groceries', 'Produits Transformés et Épicerie', 'Bewerkte Voedingsmiddelen en Kruidenierswaren'),
  ('Beverages', 'Boissons', 'Dranken');

-- Get category IDs for reference
-- Note: In actual usage, you would replace these with the actual UUIDs from the categories table

-- Insert subcategories
WITH category_refs AS (
  SELECT id, name FROM categories
)
INSERT INTO subcategories (category_id, type, type_fr, type_nl)
SELECT
  c.id,
  sub.type,
  sub.type_fr,
  sub.type_nl
FROM category_refs c
CROSS JOIN (
  VALUES
    ('Fruits and Vegetables', 'Fruits', 'Fruits', 'Fruit'),
    ('Fruits and Vegetables', 'Vegetables', 'Légumes', 'Groenten'),
    ('Dairy and Eggs', 'Dairy products', 'Produits laitiers', 'Zuivelproducten'),
    ('Dairy and Eggs', 'Eggs', 'Œufs', 'Eieren'),
    ('Meats and Poultry', 'Meats', 'Viandes', 'Vlees'),
    ('Meats and Poultry', 'Poultry', 'Volailles', 'Gevogelte'),
    ('Processed Foods and Groceries', 'Breads and Cereals', 'Pains et Céréales', 'Brood en Granen'),
    ('Processed Foods and Groceries', 'Bee Products', 'Produits de la Ruche', 'Bijenproducten'),
    ('Processed Foods and Groceries', 'Preserves and Jams', 'Conserves et Confitures', 'Conserven en Jam'),
    ('Beverages', 'Non-alcoholic drinks', 'Boissons non alcoolisées', 'Alcoholvrije dranken'),
    ('Beverages', 'Alcoholic drinks', 'Boissons alcoolisées', 'Alcoholische dranken')
) AS sub(category_name, type, type_fr, type_nl)
WHERE c.name = sub.category_name;

-- Insert products
WITH subcategory_refs AS (
  SELECT s.id, s.type, c.name as category_name
  FROM subcategories s
  JOIN categories c ON s.category_id = c.id
)
INSERT INTO products (subcategory_id, name, name_fr, name_nl)
SELECT
  s.id,
  p.name,
  p.name_fr,
  p.name_nl
FROM subcategory_refs s
CROSS JOIN (
  VALUES
    -- Fruits
    ('Fruits', 'apples', 'pommes', 'appels'),
    ('Fruits', 'pears', 'poires', 'peren'),
    ('Fruits', 'strawberries', 'fraises', 'aardbeien'),
    ('Fruits', 'cherries', 'cerises', 'kersen'),
    ('Fruits', 'plums', 'prunes', 'pruimen'),
    ('Fruits', 'raspberries', 'framboises', 'frambozen'),

    -- Vegetables
    ('Vegetables', 'carrots', 'carottes', 'wortels'),
    ('Vegetables', 'potatoes', 'pommes de terre', 'aardappels'),
    ('Vegetables', 'tomatoes', 'tomates', 'tomaten'),
    ('Vegetables', 'lettuce', 'laitue', 'sla'),
    ('Vegetables', 'zucchini', 'courgettes', 'courgettes'),
    ('Vegetables', 'onions', 'oignons', 'uien'),

    -- Dairy products
    ('Dairy products', 'milk', 'lait', 'melk'),
    ('Dairy products', 'yogurts', 'yaourts', 'yoghurt'),
    ('Dairy products', 'cheeses', 'fromages', 'kazen'),
    ('Dairy products', 'butter', 'beurre', 'boter'),
    ('Dairy products', 'cream', 'crème', 'room'),

    -- Eggs
    ('Eggs', 'fresh chicken eggs', 'œufs de poule frais', 'verse kippeneieren'),

    -- Meats
    ('Meats', 'beef', 'bœuf', 'rundvlees'),
    ('Meats', 'pork', 'porc', 'varkensvlees'),
    ('Meats', 'lamb', 'agneau', 'lamsvlees'),
    ('Meats', 'veal', 'veau', 'kalfsvlees'),

    -- Poultry
    ('Poultry', 'chicken', 'poulet', 'kip'),
    ('Poultry', 'turkey', 'dinde', 'kalkoen'),
    ('Poultry', 'duck', 'canard', 'eend'),

    -- Breads and Cereals
    ('Breads and Cereals', 'artisanal bread', 'pain artisanal', 'ambachtelijk brood'),
    ('Breads and Cereals', 'flour', 'farine', 'meel'),
    ('Breads and Cereals', 'pasta', 'pâtes', 'pasta'),

    -- Bee Products
    ('Bee Products', 'honey', 'miel', 'honing'),
    ('Bee Products', 'pollen', 'pollen', 'stuifmeel'),
    ('Bee Products', 'propolis', 'propolis', 'propolis'),

    -- Preserves and Jams
    ('Preserves and Jams', 'fruit jam', 'confiture de fruits', 'fruitjam'),
    ('Preserves and Jams', 'soups', 'soupes', 'soepen'),
    ('Preserves and Jams', 'vegetable preserves', 'conserves de légumes', 'groenteconserven'),
    ('Preserves and Jams', 'syrups', 'sirops', 'siropen'),

    -- Non-alcoholic drinks
    ('Non-alcoholic drinks', 'fruit juice', 'jus de fruits', 'vruchtensap'),
    ('Non-alcoholic drinks', 'vegetable juice', 'jus de légumes', 'groentesap'),
    ('Non-alcoholic drinks', 'non-alcoholic cider', 'cidre sans alcool', 'alcoholvrije cider'),

    -- Alcoholic drinks
    ('Alcoholic drinks', 'craft beer', 'bière artisanale', 'ambachtelijk bier'),
    ('Alcoholic drinks', 'wine', 'vin', 'wijn'),
    ('Alcoholic drinks', 'cider', 'cidre', 'cider')
) AS p(subcategory_type, name, name_fr, name_nl)
WHERE s.type = p.subcategory_type;
