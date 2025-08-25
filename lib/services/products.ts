import type {
  Category,
  CategoryWithSubcategories,
  Product,
  Subcategory,
  VendorCategory,
  VendorProduct,
  VendorSubcategory,
} from '@/lib/types/products';

import { createClient } from '@/lib/supabase/server';

// Get all categories with their subcategories and products
export async function getCategoriesWithProducts(): Promise<CategoryWithSubcategories[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select(
      `
      *,
      subcategories (
        *,
        products (*)
      )
    `
    )
    .order('name');

  if (error) throw error;
  return data as CategoryWithSubcategories[];
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('categories').select('*').order('name');

  if (error) throw error;
  return data as Category[];
}

// Get subcategories by category ID
export async function getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', categoryId)
    .order('type');

  if (error) throw error;
  return data as Subcategory[];
}

// Get products by subcategory ID
export async function getProductsBySubcategory(subcategoryId: string): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('subcategory_id', subcategoryId)
    .order('name');

  if (error) throw error;
  return data as Product[];
}

// Get vendor's selected categories
export async function getVendorCategories(vendorId: string): Promise<VendorCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vendor_categories')
    .select('*')
    .eq('vendor_id', vendorId);

  if (error) throw error;
  return data as VendorCategory[];
}

// Get vendor's selected subcategories
export async function getVendorSubcategories(vendorId: string): Promise<VendorSubcategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vendor_subcategories')
    .select('*')
    .eq('vendor_id', vendorId);

  if (error) throw error;
  return data as VendorSubcategory[];
}

// Get vendor's selected products
export async function getVendorProducts(vendorId: string): Promise<VendorProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vendor_products')
    .select('*')
    .eq('vendor_id', vendorId);

  if (error) throw error;
  return data as VendorProduct[];
}

// Add categories to vendor
export async function addVendorCategories(vendorId: string, categoryIds: string[]): Promise<void> {
  const supabase = await createClient();

  const vendorCategories = categoryIds.map((categoryId) => ({
    vendor_id: vendorId,
    category_id: categoryId,
  }));

  const { error } = await supabase.from('vendor_categories').insert(vendorCategories);

  if (error) throw error;
}

// Add subcategories to vendor
export async function addVendorSubcategories(
  vendorId: string,
  subcategoryIds: string[]
): Promise<void> {
  const supabase = await createClient();

  const vendorSubcategories = subcategoryIds.map((subcategoryId) => ({
    vendor_id: vendorId,
    subcategory_id: subcategoryId,
  }));

  const { error } = await supabase.from('vendor_subcategories').insert(vendorSubcategories);

  if (error) throw error;
}

// Add products to vendor
export async function addVendorProducts(vendorId: string, productIds: string[]): Promise<void> {
  const supabase = await createClient();

  const vendorProducts = productIds.map((productId) => ({
    vendor_id: vendorId,
    product_id: productId,
  }));

  const { error } = await supabase.from('vendor_products').insert(vendorProducts);

  if (error) throw error;
}

// Remove all vendor categories
export async function removeVendorCategories(vendorId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('vendor_categories').delete().eq('vendor_id', vendorId);

  if (error) throw error;
}

// Remove all vendor subcategories
export async function removeVendorSubcategories(vendorId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('vendor_subcategories').delete().eq('vendor_id', vendorId);

  if (error) throw error;
}

// Remove all vendor products
export async function removeVendorProducts(vendorId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('vendor_products').delete().eq('vendor_id', vendorId);

  if (error) throw error;
}

// Update vendor product selections (replaces all existing selections)
export async function updateVendorProductSelections(
  vendorId: string,
  categoryIds: string[],
  subcategoryIds: string[],
  productIds: string[]
): Promise<void> {
  const supabase = await createClient();

  // Use a transaction to ensure data consistency
  const { error } = await supabase.rpc('update_vendor_product_selections', {
    p_vendor_id: vendorId,
    p_category_ids: categoryIds,
    p_subcategory_ids: subcategoryIds,
    p_product_ids: productIds,
  });

  if (error) {
    // Fallback to manual transaction if the RPC doesn't exist
    // Remove existing selections
    await removeVendorCategories(vendorId);
    await removeVendorSubcategories(vendorId);
    await removeVendorProducts(vendorId);

    // Add new selections
    if (categoryIds.length > 0) {
      await addVendorCategories(vendorId, categoryIds);
    }
    if (subcategoryIds.length > 0) {
      await addVendorSubcategories(vendorId, subcategoryIds);
    }
    if (productIds.length > 0) {
      await addVendorProducts(vendorId, productIds);
    }
  }
}
