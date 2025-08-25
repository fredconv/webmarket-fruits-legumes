const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filename) {
  console.log(`Running migration: ${filename}`);

  const migrationPath = path.join(__dirname, 'database', 'migrations', filename);
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split SQL by semicolons and execute each statement
  const statements = sql.split(';').filter((stmt) => stmt.trim().length > 0);

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' });
      if (error) {
        console.error('Migration error:', error);
        console.error('Statement:', statement);
      }
    } catch (err) {
      console.error('Execution error:', err);
      console.error('Statement:', statement);
    }
  }

  console.log(`Completed migration: ${filename}`);
}

async function main() {
  try {
    // Run migrations in order
    await runMigration('001_create_product_categories.sql');
    await runMigration('002_populate_product_categories.sql');
    await runMigration('003_populate_vendors_with_products.sql');

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

main();
