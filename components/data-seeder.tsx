'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { useState } from 'react';

export default function DataSeeder() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // Create admin client with service role key to bypass RLS
  const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    
    if (serviceKey) {
      setResults((prev) => [...prev, '🔑 Using service role key for admin operations...']);
      return createSupabaseClient(supabaseUrl, serviceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    } else {
      setResults((prev) => [...prev, '⚠️ No service key found, using regular client...']);
      return createClient();
    }
  };

  const seedVendorsOnly = async () => {
    setLoading(true);
    setResults([]);
    const supabase = createAdminClient();

    try {
      setResults((prev) => [...prev, '📝 Inserting vendors only (Simple Mode)...']);

      const vendors = [
        {
          name: 'Ferme des Trois Chênes',
          location: 'Brussels, Belgium',
          contact_email: 'contact@fermetroischenes.be',
        },
        {
          name: 'BioMarkt Van Houten',
          location: 'Antwerp, Belgium',
          contact_email: 'info@biomarktvanhouten.be',
        },
        {
          name: 'La Ferme du Soleil',
          location: 'Liège, Belgium',
          contact_email: 'hello@fermedusoleil.be',
        },
        {
          name: 'Organic Valley Farm',
          location: 'Ghent, Belgium',
          contact_email: 'contact@organicvalley.be',
        },
        {
          name: 'De Groene Akker',
          location: 'Leuven, Belgium',
          contact_email: 'info@groeneakker.be',
        },
        {
          name: 'Fromagerie Artisanale',
          location: 'Namur, Belgium',
          contact_email: 'cheese@artisanalefromagerie.be',
        },
        {
          name: 'Boucherie Traditionnelle',
          location: 'Charleroi, Belgium',
          contact_email: 'viande@boucherietrad.be',
        },
        {
          name: 'Les Ruches du Brabant',
          location: 'Waterloo, Belgium',
          contact_email: 'miel@ruchesdubrabant.be',
        },
      ];

      const { error: vendorsError } = await supabase.from('vendors').insert(vendors);

      if (vendorsError) {
        setResults((prev) => [...prev, `❌ Vendors error: ${vendorsError.message}`]);
        return;
      }
      setResults((prev) => [...prev, '✅ 8 vendors inserted successfully']);
      setResults((prev) => [
        ...prev,
        '🎉 Simple mode completed! You can now test the vendors page.',
      ]);
      setResults((prev) => [
        ...prev,
        '💡 To add product categories, disable RLS policies in Supabase dashboard first.',
      ]);
    } catch (error) {
      setResults((prev) => [...prev, `❌ Unexpected error: ${String(error)}`]);
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    setLoading(true);
    setResults([]);
    const supabase = createAdminClient();

    try {
      // 1. Check if categories already exist and insert new ones
      setResults((prev) => [...prev, '📝 Checking existing categories...']);

      const { data: existingCategories } = await supabase.from('categories').select('name');

      const existingCategoryNames = existingCategories?.map((c) => c.name) || [];

      const categories = [
        {
          name: 'Fruits and Vegetables',
          name_fr: 'Fruits et Légumes',
          name_nl: 'Fruit en Groenten',
        },
        {
          name: 'Dairy and Eggs',
          name_fr: 'Produits Laitiers et Œufs',
          name_nl: 'Zuivel en Eieren',
        },
        {
          name: 'Meats and Poultry',
          name_fr: 'Viandes et Volailles',
          name_nl: 'Vlees en Gevogelte',
        },
        {
          name: 'Processed Foods and Groceries',
          name_fr: 'Produits Transformés et Épicerie',
          name_nl: 'Bewerkte Voedingsmiddelen en Kruidenierswaren',
        },
        { name: 'Beverages', name_fr: 'Boissons', name_nl: 'Dranken' },
      ];

      const newCategories = categories.filter((c) => !existingCategoryNames.includes(c.name));

      if (newCategories.length > 0) {
        setResults((prev) => [...prev, `📝 Inserting ${newCategories.length} new categories...`]);

        const { error: categoriesError } = await supabase.from('categories').insert(newCategories);

        if (categoriesError) {
          setResults((prev) => [...prev, `❌ Categories error: ${categoriesError.message}`]);
          return;
        }
        setResults((prev) => [
          ...prev,
          `✅ ${newCategories.length} categories inserted successfully`,
        ]);
      } else {
        setResults((prev) => [...prev, '✅ All categories already exist']);
      }

      // 2. Get category IDs
      const { data: categoryData } = await supabase.from('categories').select('id, name');

      if (!categoryData) {
        setResults((prev) => [...prev, '❌ Failed to retrieve categories']);
        return;
      }

      const categoryMap = Object.fromEntries(categoryData.map((c) => [c.name, c.id]));

      // 3. Insert subcategories
      setResults((prev) => [...prev, '📝 Inserting subcategories...']);

      const subcategories = [
        {
          category_id: categoryMap['Fruits and Vegetables'],
          type: 'Fruits',
          type_fr: 'Fruits',
          type_nl: 'Fruit',
        },
        {
          category_id: categoryMap['Fruits and Vegetables'],
          type: 'Vegetables',
          type_fr: 'Légumes',
          type_nl: 'Groenten',
        },
        {
          category_id: categoryMap['Dairy and Eggs'],
          type: 'Dairy products',
          type_fr: 'Produits laitiers',
          type_nl: 'Zuivelproducten',
        },
        {
          category_id: categoryMap['Dairy and Eggs'],
          type: 'Eggs',
          type_fr: 'Œufs',
          type_nl: 'Eieren',
        },
        {
          category_id: categoryMap['Meats and Poultry'],
          type: 'Meats',
          type_fr: 'Viandes',
          type_nl: 'Vlees',
        },
        {
          category_id: categoryMap['Meats and Poultry'],
          type: 'Poultry',
          type_fr: 'Volailles',
          type_nl: 'Gevogelte',
        },
        {
          category_id: categoryMap['Processed Foods and Groceries'],
          type: 'Breads and Cereals',
          type_fr: 'Pains et Céréales',
          type_nl: 'Brood en Granen',
        },
        {
          category_id: categoryMap['Processed Foods and Groceries'],
          type: 'Bee Products',
          type_fr: 'Produits de la Ruche',
          type_nl: 'Bijenproducten',
        },
        {
          category_id: categoryMap['Processed Foods and Groceries'],
          type: 'Preserves and Jams',
          type_fr: 'Conserves et Confitures',
          type_nl: 'Conserven en Jam',
        },
        {
          category_id: categoryMap['Beverages'],
          type: 'Non-alcoholic drinks',
          type_fr: 'Boissons non alcoolisées',
          type_nl: 'Alcoholvrije dranken',
        },
        {
          category_id: categoryMap['Beverages'],
          type: 'Alcoholic drinks',
          type_fr: 'Boissons alcoolisées',
          type_nl: 'Alcoholische dranken',
        },
      ];

      const { error: subcategoriesError } = await supabase
        .from('subcategories')
        .insert(subcategories);

      if (subcategoriesError) {
        if (subcategoriesError.message.includes('row-level security policy')) {
          setResults((prev) => [
            ...prev,
            '❌ Subcategories error: Row-Level Security policy is blocking the insert',
          ]);
          setResults((prev) => [
            ...prev,
            '💡 Try: 1) Disable RLS on subcategories table, or 2) Create policy allowing inserts',
          ]);
          setResults((prev) => [
            ...prev,
            '📝 SQL: ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;',
          ]);
        } else {
          setResults((prev) => [...prev, `❌ Subcategories error: ${subcategoriesError.message}`]);
        }
        return;
      }
      setResults((prev) => [...prev, '✅ Subcategories inserted successfully']);

      // 4. Get subcategory IDs
      const { data: subcategoryData } = await supabase.from('subcategories').select('id, type');

      if (!subcategoryData) {
        setResults((prev) => [...prev, '❌ Failed to retrieve subcategories']);
        return;
      }

      const subcategoryMap = Object.fromEntries(subcategoryData.map((s) => [s.type, s.id]));

      // 5. Insert products
      setResults((prev) => [...prev, '📝 Inserting products...']);

      const products = [
        // Fruits
        {
          subcategory_id: subcategoryMap['Fruits'],
          name: 'apples',
          name_fr: 'pommes',
          name_nl: 'appels',
        },
        {
          subcategory_id: subcategoryMap['Fruits'],
          name: 'pears',
          name_fr: 'poires',
          name_nl: 'peren',
        },
        {
          subcategory_id: subcategoryMap['Fruits'],
          name: 'strawberries',
          name_fr: 'fraises',
          name_nl: 'aardbeien',
        },
        {
          subcategory_id: subcategoryMap['Fruits'],
          name: 'cherries',
          name_fr: 'cerises',
          name_nl: 'kersen',
        },

        // Vegetables
        {
          subcategory_id: subcategoryMap['Vegetables'],
          name: 'carrots',
          name_fr: 'carottes',
          name_nl: 'wortels',
        },
        {
          subcategory_id: subcategoryMap['Vegetables'],
          name: 'potatoes',
          name_fr: 'pommes de terre',
          name_nl: 'aardappels',
        },
        {
          subcategory_id: subcategoryMap['Vegetables'],
          name: 'tomatoes',
          name_fr: 'tomates',
          name_nl: 'tomaten',
        },
        {
          subcategory_id: subcategoryMap['Vegetables'],
          name: 'lettuce',
          name_fr: 'laitue',
          name_nl: 'sla',
        },

        // Dairy products
        {
          subcategory_id: subcategoryMap['Dairy products'],
          name: 'milk',
          name_fr: 'lait',
          name_nl: 'melk',
        },
        {
          subcategory_id: subcategoryMap['Dairy products'],
          name: 'yogurts',
          name_fr: 'yaourts',
          name_nl: 'yoghurt',
        },
        {
          subcategory_id: subcategoryMap['Dairy products'],
          name: 'cheeses',
          name_fr: 'fromages',
          name_nl: 'kazen',
        },
        {
          subcategory_id: subcategoryMap['Dairy products'],
          name: 'butter',
          name_fr: 'beurre',
          name_nl: 'boter',
        },

        // Eggs
        {
          subcategory_id: subcategoryMap['Eggs'],
          name: 'fresh chicken eggs',
          name_fr: 'œufs de poule frais',
          name_nl: 'verse kippeneieren',
        },

        // Meats
        {
          subcategory_id: subcategoryMap['Meats'],
          name: 'beef',
          name_fr: 'bœuf',
          name_nl: 'rundvlees',
        },
        {
          subcategory_id: subcategoryMap['Meats'],
          name: 'pork',
          name_fr: 'porc',
          name_nl: 'varkensvlees',
        },

        // Poultry
        {
          subcategory_id: subcategoryMap['Poultry'],
          name: 'chicken',
          name_fr: 'poulet',
          name_nl: 'kip',
        },

        // Bread
        {
          subcategory_id: subcategoryMap['Breads and Cereals'],
          name: 'artisanal bread',
          name_fr: 'pain artisanal',
          name_nl: 'ambachtelijk brood',
        },

        // Bee products
        {
          subcategory_id: subcategoryMap['Bee Products'],
          name: 'honey',
          name_fr: 'miel',
          name_nl: 'honing',
        },

        // Preserves
        {
          subcategory_id: subcategoryMap['Preserves and Jams'],
          name: 'fruit jam',
          name_fr: 'confiture de fruits',
          name_nl: 'fruitjam',
        },

        // Beverages
        {
          subcategory_id: subcategoryMap['Non-alcoholic drinks'],
          name: 'fruit juice',
          name_fr: 'jus de fruits',
          name_nl: 'vruchtensap',
        },
        {
          subcategory_id: subcategoryMap['Alcoholic drinks'],
          name: 'craft beer',
          name_fr: 'bière artisanale',
          name_nl: 'ambachtelijk bier',
        },
      ];

      const { error: productsError } = await supabase.from('products').insert(products);

      if (productsError) {
        if (productsError.message.includes('row-level security policy')) {
          setResults((prev) => [
            ...prev,
            '❌ Products error: Row-Level Security policy is blocking the insert',
          ]);
          setResults((prev) => [
            ...prev,
            '💡 Try: ALTER TABLE products DISABLE ROW LEVEL SECURITY;',
          ]);
        } else {
          setResults((prev) => [...prev, `❌ Products error: ${productsError.message}`]);
        }
        return;
      }
      setResults((prev) => [...prev, '✅ Products inserted successfully']);

      // 6. Insert vendors
      setResults((prev) => [...prev, '📝 Inserting vendors...']);

      const vendors = [
        {
          name: 'Ferme des Trois Chênes',
          location: 'Brussels, Belgium',
          contact_email: 'contact@fermetroischenes.be',
        },
        {
          name: 'BioMarkt Van Houten',
          location: 'Antwerp, Belgium',
          contact_email: 'info@biomarktvanhouten.be',
        },
        {
          name: 'La Ferme du Soleil',
          location: 'Liège, Belgium',
          contact_email: 'hello@fermedusoleil.be',
        },
        {
          name: 'Organic Valley Farm',
          location: 'Ghent, Belgium',
          contact_email: 'contact@organicvalley.be',
        },
        {
          name: 'De Groene Akker',
          location: 'Leuven, Belgium',
          contact_email: 'info@groeneakker.be',
        },
        {
          name: 'Fromagerie Artisanale',
          location: 'Namur, Belgium',
          contact_email: 'cheese@artisanalefromagerie.be',
        },
        {
          name: 'Boucherie Traditionnelle',
          location: 'Charleroi, Belgium',
          contact_email: 'viande@boucherietrad.be',
        },
        {
          name: 'Les Ruches du Brabant',
          location: 'Waterloo, Belgium',
          contact_email: 'miel@ruchesdubrabant.be',
        },
      ];

      const { error: vendorsError } = await supabase.from('vendors').insert(vendors);

      if (vendorsError) {
        setResults((prev) => [...prev, `❌ Vendors error: ${vendorsError.message}`]);
        return;
      }
      setResults((prev) => [...prev, '✅ Vendors inserted successfully']);

      // 7. Create vendor-product associations
      setResults((prev) => [...prev, '📝 Creating vendor-product associations...']);

      // Get vendor and product IDs for associations
      const { data: vendorData } = await supabase.from('vendors').select('id, name');
      const { data: productData } = await supabase.from('products').select('id, name');

      if (!vendorData || !productData) {
        setResults((prev) => [...prev, '❌ Failed to retrieve vendors or products']);
        return;
      }

      const vendorMap = Object.fromEntries(vendorData.map((v) => [v.name, v.id]));
      const productMap = Object.fromEntries(productData.map((p) => [p.name, p.id]));

      // Define vendor-product associations
      const vendorProductAssociations = [
        // Ferme des Trois Chênes - Fruits and vegetables
        {
          vendor_id: vendorMap['Ferme des Trois Chênes'],
          product_ids: ['apples', 'pears', 'strawberries', 'carrots', 'potatoes', 'tomatoes'],
        },
        // BioMarkt Van Houten - Organic mix
        {
          vendor_id: vendorMap['BioMarkt Van Houten'],
          product_ids: ['apples', 'carrots', 'milk', 'yogurts', 'artisanal bread', 'honey'],
        },
        // La Ferme du Soleil - Dairy and berries
        {
          vendor_id: vendorMap['La Ferme du Soleil'],
          product_ids: [
            'milk',
            'yogurts',
            'butter',
            'fresh chicken eggs',
            'strawberries',
            'cherries',
          ],
        },
        // Organic Valley Farm - Vegetables
        {
          vendor_id: vendorMap['Organic Valley Farm'],
          product_ids: ['carrots', 'potatoes', 'tomatoes', 'lettuce'],
        },
        // De Groene Akker - Local produce
        {
          vendor_id: vendorMap['De Groene Akker'],
          product_ids: ['potatoes', 'carrots', 'artisanal bread'],
        },
        // Fromagerie Artisanale - Cheese specialist
        {
          vendor_id: vendorMap['Fromagerie Artisanale'],
          product_ids: ['cheeses', 'milk', 'butter'],
        },
        // Boucherie Traditionnelle - Meat specialist
        {
          vendor_id: vendorMap['Boucherie Traditionnelle'],
          product_ids: ['beef', 'pork', 'chicken'],
        },
        // Les Ruches du Brabant - Bee products
        {
          vendor_id: vendorMap['Les Ruches du Brabant'],
          product_ids: ['honey', 'fruit jam'],
        },
      ];

      // Insert vendor-product relationships
      const vendorProductsToInsert = [];
      for (const association of vendorProductAssociations) {
        for (const productName of association.product_ids) {
          if (productMap[productName]) {
            vendorProductsToInsert.push({
              vendor_id: association.vendor_id,
              product_id: productMap[productName],
            });
          }
        }
      }

      if (vendorProductsToInsert.length > 0) {
        const { error: vendorProductsError } = await supabase
          .from('vendor_products')
          .insert(vendorProductsToInsert);

        if (vendorProductsError) {
          setResults((prev) => [
            ...prev,
            `❌ Vendor products error: ${vendorProductsError.message}`,
          ]);
          // Don't return here, continue with category associations
        } else {
          setResults((prev) => [
            ...prev,
            `✅ ${vendorProductsToInsert.length} vendor-product associations created`,
          ]);
        }
      }

      // 8. Create vendor-category associations based on products
      setResults((prev) => [...prev, '📝 Creating vendor-category associations...']);

      // This would require a complex query, so let's create some basic associations
      const vendorCategoryAssociations = [
        {
          vendor_id: vendorMap['Ferme des Trois Chênes'],
          category_id: categoryMap['Fruits and Vegetables'],
        },
        {
          vendor_id: vendorMap['BioMarkt Van Houten'],
          category_id: categoryMap['Fruits and Vegetables'],
        },
        { vendor_id: vendorMap['BioMarkt Van Houten'], category_id: categoryMap['Dairy and Eggs'] },
        { vendor_id: vendorMap['La Ferme du Soleil'], category_id: categoryMap['Dairy and Eggs'] },
        {
          vendor_id: vendorMap['La Ferme du Soleil'],
          category_id: categoryMap['Fruits and Vegetables'],
        },
        {
          vendor_id: vendorMap['Organic Valley Farm'],
          category_id: categoryMap['Fruits and Vegetables'],
        },
        {
          vendor_id: vendorMap['De Groene Akker'],
          category_id: categoryMap['Fruits and Vegetables'],
        },
        {
          vendor_id: vendorMap['De Groene Akker'],
          category_id: categoryMap['Processed Foods and Groceries'],
        },
        {
          vendor_id: vendorMap['Fromagerie Artisanale'],
          category_id: categoryMap['Dairy and Eggs'],
        },
        {
          vendor_id: vendorMap['Boucherie Traditionnelle'],
          category_id: categoryMap['Meats and Poultry'],
        },
        {
          vendor_id: vendorMap['Les Ruches du Brabant'],
          category_id: categoryMap['Processed Foods and Groceries'],
        },
      ];

      const { error: vendorCategoriesError } = await supabase
        .from('vendor_categories')
        .insert(vendorCategoryAssociations);

      if (vendorCategoriesError) {
        setResults((prev) => [
          ...prev,
          `❌ Vendor categories error: ${vendorCategoriesError.message}`,
        ]);
      } else {
        setResults((prev) => [
          ...prev,
          `✅ ${vendorCategoryAssociations.length} vendor-category associations created`,
        ]);
      }

      setResults((prev) => [...prev, '🎉 All data seeding completed successfully!']);
    } catch (error) {
      setResults((prev) => [...prev, `❌ Unexpected error: ${String(error)}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-4'>Database Data Seeder</h1>
        <p className='text-muted-foreground'>
          Populate the database with sample categories, products, and vendors.
        </p>
      </div>

      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Seed Sample Data</CardTitle>
          <CardDescription>
            This will insert:
            <ul className='list-disc list-inside mt-2 space-y-1'>
              <li>5 product categories (Fruits & Vegetables, Dairy & Eggs, etc.)</li>
              <li>11 subcategories (Fruits, Vegetables, Meats, etc.)</li>
              <li>21 sample products with multilingual names</li>
              <li>8 sample vendors from Belgium</li>
            </ul>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <Button onClick={seedData} disabled={loading} size='lg' className='w-full'>
              {loading ? 'Seeding data...' : 'Seed Full Database (Admin Mode - Bypasses RLS)'}
            </Button>

            <div className='text-center text-sm text-muted-foreground'>or</div>

            <Button
              onClick={seedVendorsOnly}
              disabled={loading}
              variant='outline'
              size='lg'
              className='w-full'>
              {loading ? 'Seeding vendors...' : 'Seed Vendors Only (If RLS is still blocking)'}
            </Button>
            
            <div className='mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg'>
              <p className='text-sm text-blue-700 dark:text-blue-300'>
                💡 <strong>Admin Mode</strong> uses the service role key to bypass RLS policies and insert all data including categories, products, and vendor associations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Seeding Results</CardTitle>
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
