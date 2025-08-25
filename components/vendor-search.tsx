'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Category, VendorWithProducts } from '@/lib/types/products';
import { Filter, Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VendorCard } from '@/components/vendor-card';
import { useState } from 'react';

interface VendorSearchProps {
  vendors: VendorWithProducts[];
  categories: Category[];
  locale: string;
}

export function VendorSearch({ vendors, categories, locale }: VendorSearchProps) {
  const t = useTranslations('vendors');
  const tProducts = useTranslations('products');
  const currentLocale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const getLocalizedCategoryName = (category: Category) => {
    if (currentLocale === 'fr' && category.name_fr) return category.name_fr;
    if (currentLocale === 'nl' && category.name_nl) return category.name_nl;
    return category.name;
  };

  const filteredVendors = vendors.filter((vendor) => {
    // Filter by search query
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by selected categories
    const matchesCategory =
      selectedCategoryIds.length === 0 ||
      vendor.categories.some((category) => selectedCategoryIds.includes(category.id));

    return matchesSearch && matchesCategory;
  });

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategoryIds([]);
    setSearchQuery('');
  };

  return (
    <div className='space-y-6'>
      {/* Search Input */}
      <div className='space-y-2'>
        <Label htmlFor='search' className='text-sm font-medium'>
          {t('searchByName')}
        </Label>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            id='search'
            type='text'
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className='flex items-center justify-between'>
        <Button
          variant='outline'
          onClick={() => setShowFilters(!showFilters)}
          className='flex items-center gap-2'>
          <Filter className='h-4 w-4' />
          {tProducts('categories')} Filter
        </Button>

        {(selectedCategoryIds.length > 0 || searchQuery) && (
          <Button variant='ghost' onClick={clearFilters} size='sm'>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {selectedCategoryIds.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          <span className='text-sm text-muted-foreground'>Active filters:</span>
          {selectedCategoryIds.map((categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            if (!category) return null;
            return (
              <Badge
                key={categoryId}
                variant='secondary'
                className='cursor-pointer'
                onClick={() => handleCategoryToggle(categoryId)}>
                {getLocalizedCategoryName(category)} ×
              </Badge>
            );
          })}
        </div>
      )}

      {/* Category Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Filter by {tProducts('categories')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
              {categories.map((category) => (
                <div key={category.id} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategoryIds.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`} className='text-sm cursor-pointer'>
                    {getLocalizedCategoryName(category)}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {filteredVendors.length === 0 ? (
        <div className='text-center py-12'>
          <h2 className='text-xl font-semibold mb-2'>{t('noVendorsFound')}</h2>
          <p className='text-muted-foreground mb-4'>
            {searchQuery || selectedCategoryIds.length > 0
              ? 'No vendors found matching your search criteria'
              : t('noVendorsDescription')}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
