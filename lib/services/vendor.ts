import { CreateVendorInput, UpdateVendorInput, Vendor } from '@/lib/types/vendor';

import { VendorWithProducts } from '@/lib/types/products';
import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@/lib/supabase/server';

// Type for category data from Supabase queries
interface CategoryData {
  id: string;
  name: string;
  name_fr: string;
  name_nl: string;
}

interface SubcategoryData {
  id: string;
  name: string;
  name_fr: string;
  name_nl: string;
  category_id: string;
}

interface ProductData {
  id: string;
  name: string;
  name_fr: string;
  name_nl: string;
  subcategory_id: string;
}

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

// Get vendors with their associated categories for display as tags
export async function getVendorsWithCategories(): Promise<VendorWithProducts[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('vendors')
    .select(
      `
      *,
      vendor_categories (
        categories (
          id,
          name,
          name_fr,
          name_nl
        )
      )
    `
    )
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching vendors with categories:', error);
    throw new Error('Failed to fetch vendors with categories');
  }

  // Transform the data to match our VendorWithProducts interface
  return (data || []).map((vendor) => ({
    ...vendor,
    categories:
      vendor.vendor_categories?.map((vc: { categories: CategoryData }) => ({
        ...vc.categories,
        created_at: '',
        updated_at: '',
      })) || [],
    subcategories: [], // We'll add this if needed later
    products: [], // We'll add this if needed later
  }));
}

// Get vendors filtered by category IDs
export async function getVendorsByCategories(categoryIds: string[]): Promise<VendorWithProducts[]> {
  if (categoryIds.length === 0) {
    return getVendorsWithCategories();
  }

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('vendors')
    .select(
      `
      *,
      vendor_categories!inner (
        categories (
          id,
          name,
          name_fr,
          name_nl
        )
      )
    `
    )
    .in('vendor_categories.category_id', categoryIds)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching vendors by categories:', error);
    throw new Error('Failed to fetch vendors by categories');
  }

  // Transform and deduplicate vendors (in case a vendor has multiple matching categories)
  const vendorMap = new Map<string, VendorWithProducts>();

  (data || []).forEach((vendor) => {
    if (!vendorMap.has(vendor.id)) {
      vendorMap.set(vendor.id, {
        ...vendor,
        categories: [],
        subcategories: [],
        products: [],
      });
    }

    // Add categories to the vendor
    const vendorData = vendorMap.get(vendor.id);
    if (vendorData) {
      vendor.vendor_categories?.forEach((vc: { categories: CategoryData }) => {
        if (vc.categories && !vendorData.categories.some((c) => c.id === vc.categories.id)) {
          vendorData.categories.push({
            ...vc.categories,
            created_at: '',
            updated_at: '',
          });
        }
      });
    }
  });

  return Array.from(vendorMap.values());
}

// Get vendor by ID with all their products and categories for detail page
export async function getVendorByIdWithProducts(id: string): Promise<VendorWithProducts | null> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('vendors')
    .select(
      `
      *,
      vendor_categories (
        categories (
          id,
          name,
          name_fr,
          name_nl
        )
      ),
      vendor_subcategories (
        subcategories (
          id,
          type,
          type_fr,
          type_nl,
          category_id
        )
      ),
      vendor_products (
        products (
          id,
          name,
          name_fr,
          name_nl,
          subcategory_id
        )
      )
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching vendor with products:', error);
    throw new Error('Failed to fetch vendor with products');
  }

  // Transform the data
  return {
    ...data,
    categories:
      data.vendor_categories?.map((vc: { categories: CategoryData }) => ({
        ...vc.categories,
        created_at: '',
        updated_at: '',
      })) || [],
    subcategories:
      data.vendor_subcategories?.map((vs: { subcategories: SubcategoryData }) => ({
        ...vs.subcategories,
        type: vs.subcategories.name,
        type_fr: vs.subcategories.name_fr,
        type_nl: vs.subcategories.name_nl,
        created_at: '',
        updated_at: '',
      })) || [],
    products:
      data.vendor_products?.map((vp: { products: ProductData }) => ({
        ...vp.products,
        created_at: '',
        updated_at: '',
      })) || [],
  };
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
