import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { VendorWithProducts } from '@/lib/types/products';
import { useLocale } from 'next-intl';

interface VendorCardProps {
  vendor: VendorWithProducts;
  locale?: string;
}

export function VendorCard({ vendor, locale }: VendorCardProps) {
  const currentLocale = useLocale();
  const displayLocale = locale || currentLocale;
  const href = locale ? `/${locale}/vendors/${vendor.id}` : `/vendors/${vendor.id}`;

  const getLocalizedCategoryName = (category: {
    id: string;
    name: string;
    name_fr?: string;
    name_nl?: string;
  }) => {
    if (displayLocale === 'fr' && category.name_fr) return category.name_fr;
    if (displayLocale === 'nl' && category.name_nl) return category.name_nl;
    return category.name;
  };

  return (
    <Link href={href} className='block transition-transform hover:scale-105'>
      <Card className='h-full hover:shadow-lg transition-shadow'>
        <CardHeader>
          <CardTitle className='text-lg'>{vendor.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <MapPin className='h-4 w-4' />
              <span>{vendor.location}</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Mail className='h-4 w-4' />
              <span className='truncate'>{vendor.contact_email}</span>
            </div>

            {/* Category tags */}
            {vendor.categories && vendor.categories.length > 0 && (
              <div className='flex flex-wrap gap-1'>
                {vendor.categories.map((category) => (
                  <Badge key={category.id} variant='outline' className='text-xs'>
                    {getLocalizedCategoryName(category)}
                  </Badge>
                ))}
              </div>
            )}

            <Badge variant='secondary' className='text-xs'>
              Vendor
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
