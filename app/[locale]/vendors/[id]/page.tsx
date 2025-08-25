import { ArrowLeft, Calendar, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getVendorByIdWithProducts } from '@/lib/services/vendor';
import { notFound } from 'next/navigation';

interface VendorPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { id, locale } = await params;
  const vendor = await getVendorByIdWithProducts(id);
  const t = await getTranslations('vendors');
  const tProducts = await getTranslations('products');

  if (!vendor) {
    notFound();
  }

  const getLocalizedCategoryName = (category: {
    id: string;
    name: string;
    name_fr?: string;
    name_nl?: string;
  }) => {
    if (locale === 'fr' && category.name_fr) return category.name_fr;
    if (locale === 'nl' && category.name_nl) return category.name_nl;
    return category.name;
  };

  const getLocalizedProductName = (product: {
    id: string;
    name: string;
    name_fr?: string;
    name_nl?: string;
  }) => {
    if (locale === 'fr' && product.name_fr) return product.name_fr;
    if (locale === 'nl' && product.name_nl) return product.name_nl;
    return product.name;
  };

  // Group products by category for better display
  const productsByCategory = vendor.categories.reduce(
    (
      acc: Record<
        string,
        { category: (typeof vendor.categories)[0]; products: typeof vendor.products }
      >,
      category
    ) => {
      const categoryProducts = vendor.products.filter((product) => {
        // Find the subcategory for this product
        const subcategory = vendor.subcategories.find((sub) => sub.id === product.subcategory_id);
        return subcategory && subcategory.category_id === category.id;
      });

      if (categoryProducts.length > 0) {
        acc[category.id] = {
          category,
          products: categoryProducts,
        };
      }
      return acc;
    },
    {}
  );

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <Button variant='ghost' asChild className='mb-4'>
          <Link href={`/${locale}/vendors`}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            {t('backToVendors')}
          </Link>
        </Button>
      </div>

      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Vendor Details Card */}
        <Card>
          <CardHeader>
            <div className='flex justify-between items-start'>
              <div>
                <CardTitle className='text-2xl mb-2'>{vendor.name}</CardTitle>
                <div className='flex flex-wrap gap-2 mb-4'>
                  {vendor.categories.map((category) => (
                    <Badge key={category.id} variant='default' className='text-sm'>
                      {getLocalizedCategoryName(category)}
                    </Badge>
                  ))}
                </div>
                <Badge variant='secondary'>{t('vendor')}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid gap-4'>
              <div className='flex items-center gap-3'>
                <MapPin className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>{t('location')}</p>
                  <p className='text-muted-foreground'>{vendor.location}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Mail className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>{t('contactEmail')}</p>
                  <a
                    href={`mailto:${vendor.contact_email}`}
                    className='text-blue-600 hover:underline'>
                    {vendor.contact_email}
                  </a>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Calendar className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>{t('memberSince')}</p>
                  <p className='text-muted-foreground'>
                    {new Date(vendor.created_at).toLocaleDateString(
                      locale === 'en' ? 'en-US' : locale === 'fr' ? 'fr-FR' : 'nl-NL',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className='pt-4 border-t'>
              <div className='flex gap-3'>
                <Button asChild>
                  <a href={`mailto:${vendor.contact_email}`}>
                    <Mail className='h-4 w-4 mr-2' />
                    {t('contactVendor')}
                  </a>
                </Button>
                <Button variant='outline' asChild>
                  <Link href={`/${locale}/vendors/${vendor.id}/edit`}>{t('editDetails')}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products by Category */}
        {Object.keys(productsByCategory).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>{tProducts('products')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {Object.values(productsByCategory).map((categoryGroup) => (
                <div key={categoryGroup.category.id} className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline' className='text-sm'>
                      {getLocalizedCategoryName(categoryGroup.category)}
                    </Badge>
                    <span className='text-sm text-muted-foreground'>
                      ({categoryGroup.products.length}{' '}
                      {categoryGroup.products.length === 1 ? 'product' : 'products'})
                    </span>
                  </div>
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                    {categoryGroup.products.map((product) => (
                      <div key={product.id} className='p-2 bg-gray-50 rounded-lg text-sm'>
                        {getLocalizedProductName(product)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* No Products Message */}
        {Object.keys(productsByCategory).length === 0 && (
          <Card>
            <CardContent className='text-center py-8'>
              <p className='text-muted-foreground'>
                This vendor hasn&apos;t specified any products yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
