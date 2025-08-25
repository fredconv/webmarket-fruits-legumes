'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import type { CategoryWithSubcategories } from '@/lib/types/products';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ProductSelectionProps {
  categories: CategoryWithSubcategories[];
  selectedCategoryIds: string[];
  selectedSubcategoryIds: string[];
  selectedProductIds: string[];
  onSelectionChange: (
    categoryIds: string[],
    subcategoryIds: string[],
    productIds: string[]
  ) => void;
}

export function ProductSelection({
  categories,
  selectedCategoryIds,
  selectedSubcategoryIds,
  selectedProductIds,
  onSelectionChange,
}: ProductSelectionProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  // Local state for selections
  const [localCategoryIds, setLocalCategoryIds] = useState<string[]>(selectedCategoryIds);
  const [localSubcategoryIds, setLocalSubcategoryIds] = useState<string[]>(selectedSubcategoryIds);
  const [localProductIds, setLocalProductIds] = useState<string[]>(selectedProductIds);

  // Update local state when props change
  useEffect(() => {
    setLocalCategoryIds(selectedCategoryIds);
    setLocalSubcategoryIds(selectedSubcategoryIds);
    setLocalProductIds(selectedProductIds);
  }, [selectedCategoryIds, selectedSubcategoryIds, selectedProductIds]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId);
      } else {
        newSet.add(subcategoryId);
      }
      return newSet;
    });
  };

  const handleCategorySelection = (categoryId: string, checked: boolean) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    let newCategoryIds = [...localCategoryIds];
    let newSubcategoryIds = [...localSubcategoryIds];
    let newProductIds = [...localProductIds];

    if (checked) {
      // Add category
      if (!newCategoryIds.includes(categoryId)) {
        newCategoryIds.push(categoryId);
      }

      // Add all subcategories and products in this category
      category.subcategories.forEach((sub) => {
        if (!newSubcategoryIds.includes(sub.id)) {
          newSubcategoryIds.push(sub.id);
        }
        sub.products.forEach((product) => {
          if (!newProductIds.includes(product.id)) {
            newProductIds.push(product.id);
          }
        });
      });
    } else {
      // Remove category
      newCategoryIds = newCategoryIds.filter((id) => id !== categoryId);

      // Remove all subcategories and products in this category
      category.subcategories.forEach((sub) => {
        newSubcategoryIds = newSubcategoryIds.filter((id) => id !== sub.id);
        sub.products.forEach((product) => {
          newProductIds = newProductIds.filter((id) => id !== product.id);
        });
      });
    }

    setLocalCategoryIds(newCategoryIds);
    setLocalSubcategoryIds(newSubcategoryIds);
    setLocalProductIds(newProductIds);
    onSelectionChange(newCategoryIds, newSubcategoryIds, newProductIds);
  };

  const handleSubcategorySelection = (subcategoryId: string, checked: boolean) => {
    const category = categories.find((c) =>
      c.subcategories.some((sub) => sub.id === subcategoryId)
    );
    const subcategory = category?.subcategories.find((sub) => sub.id === subcategoryId);
    if (!category || !subcategory) return;

    let newSubcategoryIds = [...localSubcategoryIds];
    let newProductIds = [...localProductIds];
    let newCategoryIds = [...localCategoryIds];

    if (checked) {
      // Add subcategory
      if (!newSubcategoryIds.includes(subcategoryId)) {
        newSubcategoryIds.push(subcategoryId);
      }

      // Add all products in this subcategory
      subcategory.products.forEach((product) => {
        if (!newProductIds.includes(product.id)) {
          newProductIds.push(product.id);
        }
      });

      // Check if all subcategories in this category are selected
      const allSubcategoriesSelected = category.subcategories.every((sub) =>
        newSubcategoryIds.includes(sub.id)
      );
      if (allSubcategoriesSelected && !newCategoryIds.includes(category.id)) {
        newCategoryIds.push(category.id);
      }
    } else {
      // Remove subcategory
      newSubcategoryIds = newSubcategoryIds.filter((id) => id !== subcategoryId);

      // Remove all products in this subcategory
      subcategory.products.forEach((product) => {
        newProductIds = newProductIds.filter((id) => id !== product.id);
      });

      // Remove category if no subcategories are left
      newCategoryIds = newCategoryIds.filter((id) => id !== category.id);
    }

    setLocalCategoryIds(newCategoryIds);
    setLocalSubcategoryIds(newSubcategoryIds);
    setLocalProductIds(newProductIds);
    onSelectionChange(newCategoryIds, newSubcategoryIds, newProductIds);
  };

  const handleProductSelection = (productId: string, checked: boolean) => {
    let newProductIds = [...localProductIds];

    if (checked) {
      if (!newProductIds.includes(productId)) {
        newProductIds.push(productId);
      }
    } else {
      newProductIds = newProductIds.filter((id) => id !== productId);
    }

    setLocalProductIds(newProductIds);
    onSelectionChange(localCategoryIds, localSubcategoryIds, newProductIds);
  };

  const getLocalizedName = (item: { name: string; name_fr?: string; name_nl?: string }) => {
    if (locale === 'fr' && item.name_fr) return item.name_fr;
    if (locale === 'nl' && item.name_nl) return item.name_nl;
    return item.name;
  };

  const getLocalizedType = (item: { type: string; type_fr?: string; type_nl?: string }) => {
    if (locale === 'fr' && item.type_fr) return item.type_fr;
    if (locale === 'nl' && item.type_nl) return item.type_nl;
    return item.type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('selectProducts')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {categories.map((category) => (
          <div key={category.id} className='border rounded-lg p-4'>
            <div className='flex items-center space-x-2 mb-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => toggleCategory(category.id)}
                className='p-0 h-auto'>
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className='h-4 w-4' />
                ) : (
                  <ChevronRight className='h-4 w-4' />
                )}
              </Button>
              <Checkbox
                id={`category-${category.id}`}
                checked={localCategoryIds.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleCategorySelection(category.id, checked as boolean)
                }
              />
              <Label htmlFor={`category-${category.id}`} className='font-semibold cursor-pointer'>
                {getLocalizedName(category)}
              </Label>
            </div>

            {expandedCategories.has(category.id) && (
              <div className='ml-6 space-y-3'>
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className='border-l-2 border-gray-200 pl-4'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => toggleSubcategory(subcategory.id)}
                        className='p-0 h-auto'>
                        {expandedSubcategories.has(subcategory.id) ? (
                          <ChevronDown className='h-4 w-4' />
                        ) : (
                          <ChevronRight className='h-4 w-4' />
                        )}
                      </Button>
                      <Checkbox
                        id={`subcategory-${subcategory.id}`}
                        checked={localSubcategoryIds.includes(subcategory.id)}
                        onCheckedChange={(checked) =>
                          handleSubcategorySelection(subcategory.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`subcategory-${subcategory.id}`}
                        className='font-medium cursor-pointer'>
                        {getLocalizedType(subcategory)}
                      </Label>
                    </div>

                    {expandedSubcategories.has(subcategory.id) && (
                      <div className='ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                        {subcategory.products.map((product) => (
                          <div key={product.id} className='flex items-center space-x-2'>
                            <Checkbox
                              id={`product-${product.id}`}
                              checked={localProductIds.includes(product.id)}
                              onCheckedChange={(checked) =>
                                handleProductSelection(product.id, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={`product-${product.id}`}
                              className='text-sm cursor-pointer'>
                              {getLocalizedName(product)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
