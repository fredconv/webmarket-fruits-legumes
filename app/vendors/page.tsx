import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { VendorCard } from '@/components/vendor-card';
import { getVendors } from '@/lib/services/vendor';

export default async function VendorsPage() {
  const vendors = await getVendors();

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>Vendors</h1>
          <p className='text-muted-foreground mt-2'>
            Discover our trusted fruit and vegetable vendors
          </p>
        </div>
        <Button asChild>
          <Link href='/vendors/new'>
            <Plus className='h-4 w-4 mr-2' />
            Add Vendor
          </Link>
        </Button>
      </div>

      {vendors.length === 0 ? (
        <div className='text-center py-12'>
          <h2 className='text-xl font-semibold mb-2'>No vendors found</h2>
          <p className='text-muted-foreground mb-4'>
            Be the first to add a vendor to our marketplace!
          </p>
          <Button asChild>
            <Link href='/vendors/new'>Add First Vendor</Link>
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
}
