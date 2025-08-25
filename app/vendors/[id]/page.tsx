import { ArrowLeft, Calendar, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getVendorById } from '@/lib/services/vendor';
import { notFound } from 'next/navigation';

interface VendorPageProps {
  params: Promise<{ id: string }>;
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { id } = await params;
  const vendor = await getVendorById(id);

  if (!vendor) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <Button variant='ghost' asChild className='mb-4'>
          <Link href='/vendors'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Vendors
          </Link>
        </Button>
      </div>

      <div className='max-w-2xl mx-auto'>
        <Card>
          <CardHeader>
            <div className='flex justify-between items-start'>
              <div>
                <CardTitle className='text-2xl mb-2'>{vendor.name}</CardTitle>
                <Badge variant='secondary'>Vendor</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid gap-4'>
              <div className='flex items-center gap-3'>
                <MapPin className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>Location</p>
                  <p className='text-muted-foreground'>{vendor.location}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Mail className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>Contact Email</p>
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
                  <p className='font-medium'>Member Since</p>
                  <p className='text-muted-foreground'>
                    {new Date(vendor.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className='pt-4 border-t'>
              <div className='flex gap-3'>
                <Button asChild>
                  <a href={`mailto:${vendor.contact_email}`}>
                    <Mail className='h-4 w-4 mr-2' />
                    Contact Vendor
                  </a>
                </Button>
                <Button variant='outline' asChild>
                  <Link href={`/vendors/${vendor.id}/edit`}>Edit Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
