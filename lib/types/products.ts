// Import existing Vendor type

import type { Vendor } from './vendor';

export interface Category {
  id: string;
  name: string;
  name_fr?: string;
  name_nl?: string;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  type: string;
  type_fr?: string;
  type_nl?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  subcategory_id: string;
  name: string;
  name_fr?: string;
  name_nl?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorProduct {
  id: string;
  vendor_id: string;
  product_id: string;
  created_at: string;
}

export interface VendorSubcategory {
  id: string;
  vendor_id: string;
  subcategory_id: string;
  created_at: string;
}

export interface VendorCategory {
  id: string;
  vendor_id: string;
  category_id: string;
  created_at: string;
}

// Extended types with relationships
export interface CategoryWithSubcategories extends Category {
  subcategories: SubcategoryWithProducts[];
}

export interface SubcategoryWithProducts extends Subcategory {
  products: Product[];
}

export interface VendorWithProducts extends Vendor {
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
}

// Re-export existing Vendor type
export type { Vendor } from './vendor';

// Supabase query result types
export interface VendorCategoryRelation {
  categories: Category;
}

export interface VendorSubcategoryRelation {
  subcategories: Subcategory;
}

export interface VendorProductRelation {
  products: Product;
}
