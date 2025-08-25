'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewVendorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact_email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.from('vendors').insert([formData]);

      if (error) throw error;

      router.push('/vendors');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle>Add New Vendor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='name'>Vendor Name</Label>
                <Input
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor='contact_email'>Contact Email</Label>
                <Input
                  id='contact_email'
                  name='contact_email'
                  type='email'
                  value={formData.contact_email}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <div className='text-red-500 text-sm'>{error}</div>}

              <div className='flex gap-3 pt-4'>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Vendor'}
                </Button>
                <Button type='button' variant='outline' asChild>
                  <Link href='/vendors'>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
