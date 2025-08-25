import { CreateVendorInput, UpdateVendorInput, Vendor } from '@/lib/types/vendor';
import { createClient } from '@/lib/supabase/server';
import { createBrowserClient } from '@supabase/ssr';

// Create a public client for read operations that don't require authentication
function createPublicClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
  );
}

export async function getVendors(): Promise<Vendor[]> {
  // Use public client for read-only operations to avoid authentication issues
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching vendors:', error);
    throw new Error('Failed to fetch vendors');
  }

  return data || [];
}

export async function getVendorById(id: string): Promise<Vendor | null> {
  // Use public client for read-only operations to avoid authentication issues
  const supabase = createPublicClient();

  const { data, error } = await supabase.from('vendors').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching vendor:', error);
    throw new Error('Failed to fetch vendor');
  }

  return data;
}

export async function createVendor(vendor: CreateVendorInput): Promise<Vendor> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('vendors').insert([vendor]).select().single();

  if (error) {
    console.error('Error creating vendor:', error);
    throw new Error('Failed to create vendor');
  }

  return data;
}

export async function updateVendor(id: string, updates: UpdateVendorInput): Promise<Vendor> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vendors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating vendor:', error);
    throw new Error('Failed to update vendor');
  }

  return data;
}

export async function deleteVendor(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('vendors').delete().eq('id', id);

  if (error) {
    console.error('Error deleting vendor:', error);
    throw new Error('Failed to delete vendor');
  }
}
