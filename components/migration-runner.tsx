'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Migration {
  name: string;
  description: string;
  sql: string;
}

const migrations: Migration[] = [
  {
    name: 'Create Product Categories Schema',
    description: 'Creates categories, subcategories, products tables and vendor junction tables',
    sql: `
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255),
  name_nl VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  type_fr VARCHAR(255),
  type_nl VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255),
  name_nl VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create vendor_products junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS vendor_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(vendor_id, product_id)
);

-- Create vendor_subcategories junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS vendor_subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(vendor_id, subcategory_id)
);

-- Create vendor_categories junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS vendor_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(vendor_id, category_id)
);
    `,
  },
  {
    name: 'Populate Product Categories',
    description: 'Inserts categories, subcategories and products with translations',
    sql: `
-- Insert categories with translations
INSERT INTO categories (name, name_fr, name_nl) VALUES
  ('Fruits and Vegetables', 'Fruits et Légumes', 'Fruit en Groenten'),
  ('Dairy and Eggs', 'Produits Laitiers et Œufs', 'Zuivel en Eieren'),
  ('Meats and Poultry', 'Viandes et Volailles', 'Vlees en Gevogelte'),
  ('Processed Foods and Groceries', 'Produits Transformés et Épicerie', 'Bewerkte Voedingsmiddelen en Kruidenierswaren'),
  ('Beverages', 'Boissons', 'Dranken')
ON CONFLICT (name) DO NOTHING;
    `,
  },
  {
    name: 'Populate Mock Vendors',
    description: 'Creates sample vendors with realistic product associations',
    sql: `
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
  ('Brasserie du Terroir', 'Mechelen, Belgium', 'biere@brasserieduterroir.be')
ON CONFLICT (contact_email) DO NOTHING;
    `,
  },
];

export default function MigrationRunner() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);

  const runMigration = async (migration: Migration) => {
    setLoading(migration.name);
    try {
      const supabase = createClient();

      // Split SQL by semicolons and execute each statement
      const statements = migration.sql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        const { error } = await supabase.rpc('execute_sql', { query: statement });
        if (error) {
          console.error('Migration error:', error);
          setResults((prev) => [...prev, `❌ ${migration.name}: ${error.message}`]);
          return;
        }
      }

      setResults((prev) => [...prev, `✅ ${migration.name}: Completed successfully`]);
    } catch (error) {
      console.error('Execution error:', error);
      setResults((prev) => [...prev, `❌ ${migration.name}: ${String(error)}`]);
    } finally {
      setLoading(null);
    }
  };

  const runAllMigrations = async () => {
    setResults([]);
    for (const migration of migrations) {
      await runMigration(migration);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-4'>Database Migration Runner</h1>
        <p className='text-muted-foreground'>
          Run these migrations to set up the product categories and populate sample vendor data.
        </p>
      </div>

      <div className='space-y-4 mb-8'>
        {migrations.map((migration, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                {migration.name}
                <Button
                  onClick={() => runMigration(migration)}
                  disabled={loading === migration.name}
                  variant='outline'
                  size='sm'>
                  {loading === migration.name ? 'Running...' : 'Run Migration'}
                </Button>
              </CardTitle>
              <CardDescription>{migration.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className='mb-8'>
        <Button onClick={runAllMigrations} disabled={!!loading} size='lg'>
          {loading ? 'Running migrations...' : 'Run All Migrations'}
        </Button>
      </div>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Migration Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {results.map((result, index) => (
                <div key={index} className='font-mono text-sm'>
                  {result}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
