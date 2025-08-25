import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Vendor } from '@/lib/types/vendor';

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link href={`/vendors/${vendor.id}`} className='block transition-transform hover:scale-105'>
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
            <Badge variant='secondary' className='text-xs'>
              Vendor
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
