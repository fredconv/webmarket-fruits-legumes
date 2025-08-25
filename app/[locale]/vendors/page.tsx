import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { VendorSearch } from '@/components/vendor-search';
import { getCategories } from '@/lib/services/products';
import { getTranslations } from 'next-intl/server';
import { getVendorsWithCategories } from '@/lib/services/vendor';

export default async function VendorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('vendors');
  const vendors = await getVendorsWithCategories();
  const categories = await getCategories();

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>{t('title')}</h1>
          <p className='text-muted-foreground mt-2'>{t('description')}</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/vendors/new`}>
            <Plus className='h-4 w-4 mr-2' />
            {t('addVendor')}
          </Link>
        </Button>
      </div>

      {vendors.length === 0 ? (
        <div className='text-center py-12'>
          <h2 className='text-xl font-semibold mb-2'>{t('noVendorsFound')}</h2>
          <p className='text-muted-foreground mb-4'>{t('noVendorsDescription')}</p>
          <Button asChild>
            <Link href={`/${locale}/vendors/new`}>{t('addFirstVendor')}</Link>
          </Button>
        </div>
      ) : (
        <VendorSearch vendors={vendors} categories={categories} locale={locale} />
      )}
    </div>
  );
}
