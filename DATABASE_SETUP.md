# Database Setup Instructions for Product Categories

## Overview

This document outlines the steps needed to set up the product categories system in your Supabase database.

## Database Schema

### Tables Created:

1. **categories** - Main product categories (Fruits and Vegetables, Dairy and Eggs, etc.)
2. **subcategories** - Subcategories within each category (Fruits, Vegetables, etc.)
3. **products** - Individual products (apples, carrots, milk, etc.)
4. **vendor_categories** - Junction table linking vendors to categories
5. **vendor_subcategories** - Junction table linking vendors to subcategories
6. **vendor_products** - Junction table linking vendors to products

## Setup Steps

### 1. Run Database Migrations

Execute the following SQL files in your Supabase SQL editor:

1. **First**: Run `database/migrations/001_create_product_categories.sql`

   - Creates all the necessary tables with proper relationships
   - Sets up indexes for performance
   - Configures Row Level Security (RLS) policies

2. **Second**: Run `database/migrations/002_populate_product_categories.sql`
   - Populates the categories, subcategories, and products tables
   - Includes translations for English, French, and Dutch

### 2. Verify Tables

After running the migrations, you should have these tables in your Supabase database:

- `categories` (5 rows)
- `subcategories` (11 rows)
- `products` (37 rows)
- `vendor_categories` (empty, will be populated when vendors select products)
- `vendor_subcategories` (empty, will be populated when vendors select products)
- `vendor_products` (empty, will be populated when vendors select products)

### 3. Test the System

1. Go to your vendor creation page: `http://localhost:3002/en/vendors/new`
2. Fill in vendor details
3. Expand categories to see subcategories and products
4. Select products that the vendor will sell
5. Submit the form

## Features Implemented

### 🎯 **Vendor Product Selection**

- Hierarchical product selection (Category → Subcategory → Product)
- Multi-language support (EN/FR/NL)
- Collapsible tree structure for easy navigation
- Bulk selection (selecting a category selects all its subcategories and products)

### 🗄️ **Database Structure**

- Normalized database design with proper relationships
- Support for many-to-many relationships between vendors and products
- Multilingual product names and categories
- Optimized with proper indexes

### 🔒 **Security**

- Row Level Security (RLS) enabled on all tables
- Public read access for product data
- Authenticated users can manage their vendor-product relationships

### 🌐 **Internationalization**

- All product categories, subcategories, and products have translations
- UI automatically displays the correct language based on user's locale
- Fallback to English if translation is not available

## Code Structure

### Types (`lib/types/products.ts`)

- TypeScript interfaces for all database entities
- Extended types with relationships for complex queries

### Services (`lib/services/products.ts`)

- Database service functions for CRUD operations
- Helper functions for vendor-product relationships
- Transaction support for data consistency

### Components (`components/product-selection.tsx`)

- Interactive product selection component
- Hierarchical checkbox system
- Responsive design for mobile and desktop

### Updated Pages

- **Vendor Creation**: Now includes product selection
- **Vendor Editing**: Can be extended to edit product selections
- **Vendor Display**: Can show selected products (future enhancement)

## Next Steps

1. **Run the database migrations** as outlined above
2. **Test the vendor creation flow** with product selection
3. **Optional**: Extend vendor editing page to allow changing product selections
4. **Optional**: Display vendor products on vendor detail pages
5. **Optional**: Add product-based filtering to vendor search

## Database Migration Files Location

- `database/migrations/001_create_product_categories.sql`
- `database/migrations/002_populate_product_categories.sql`

Execute these files in order in your Supabase SQL editor to set up the complete product categories system.
