'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CategoryWithSubcategories } from '@/lib/types/products';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ProductSelection } from '@/components/product-selection';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function NewVendorPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('vendorForm');
  const tVendors = useTranslations('vendors');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact_email: '',
  });
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient();
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
        setCategories(data as CategoryWithSubcategories[]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const supabase = createClient();

      // Insert vendor first
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .insert([formData])
        .select()
        .single();

      if (vendorError) throw vendorError;

      // Insert vendor-product relationships if any products are selected
      if (selectedProductIds.length > 0) {
        const vendorProducts = selectedProductIds.map((productId) => ({
          vendor_id: vendorData.id,
          product_id: productId,
        }));

        const { error: productsError } = await supabase
          .from('vendor_products')
          .insert(vendorProducts);

        if (productsError) throw productsError;
      }

      // Insert vendor-subcategory relationships if any subcategories are selected
      if (selectedSubcategoryIds.length > 0) {
        const vendorSubcategories = selectedSubcategoryIds.map((subcategoryId) => ({
          vendor_id: vendorData.id,
          subcategory_id: subcategoryId,
        }));

        const { error: subcategoriesError } = await supabase
          .from('vendor_subcategories')
          .insert(vendorSubcategories);

        if (subcategoriesError) throw subcategoriesError;
      }

      // Insert vendor-category relationships if any categories are selected
      if (selectedCategoryIds.length > 0) {
        const vendorCategories = selectedCategoryIds.map((categoryId) => ({
          vendor_id: vendorData.id,
          category_id: categoryId,
        }));

        const { error: categoriesError } = await supabase
          .from('vendor_categories')
          .insert(vendorCategories);

        if (categoriesError) throw categoriesError;
      }

      router.push(`/${locale}/vendors`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon('anErrorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProductSelectionChange = (
    categoryIds: string[],
    subcategoryIds: string[],
    productIds: string[]
  ) => {
    setSelectedCategoryIds(categoryIds);
    setSelectedSubcategoryIds(subcategoryIds);
    setSelectedProductIds(productIds);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <Button variant='ghost' asChild className='mb-4'>
          <Link href={`/${locale}/vendors`}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            {tVendors('backToVendors')}
          </Link>
        </Button>
      </div>

      <div className='max-w-4xl mx-auto space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>{t('addNewVendor')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>{t('vendorName')}</Label>
                  <Input
                    id='name'
                    name='name'
                    type='text'
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='contact_email'>{tVendors('contactEmail')}</Label>
                  <Input
                    id='contact_email'
                    name='contact_email'
                    type='email'
                    required
                    value={formData.contact_email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='location'>{tVendors('location')}</Label>
                <Input
                  id='location'
                  name='location'
                  type='text'
                  required
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              {error && <div className='text-red-600 text-sm'>{error}</div>}

              <div className='flex gap-3 pt-4'>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? t('adding') : t('addVendor')}
                </Button>
                <Button type='button' variant='outline' asChild>
                  <Link href={`/${locale}/vendors`}>{t('cancel')}</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {categories.length > 0 && (
          <ProductSelection
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            selectedSubcategoryIds={selectedSubcategoryIds}
            selectedProductIds={selectedProductIds}
            onSelectionChange={handleProductSelectionChange}
          />
        )}
      </div>
    </div>
  );
}
