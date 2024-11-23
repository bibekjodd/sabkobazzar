'use client';

import { usePrevious } from '@/hooks/use-previous';
import { useTimeout } from '@/hooks/use-timeout';
import { productsCategories, productsResultSortOptions } from '@/lib/constants';
import { formatPrice, getSearchString } from '@/lib/utils';
import { useLoadingBar } from '@jodd/next-top-loading-bar';
import { Filter, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';

export type SearchProductsParams = {
  title: string | undefined | null;
  category: string | undefined | null;
  pricegte: string | undefined | null;
  pricelte: string | undefined | null;
  sort:
    | 'title_asc'
    | 'title_desc'
    | 'price_asc'
    | 'price_desc'
    | 'added_at_asc'
    | 'added_at_desc'
    | null
    | undefined;
};
export default function FilterProducts({ searchParams }: { searchParams: SearchProductsParams }) {
  const startRouteTransition = useLoadingBar((state) => state.start);
  const [filterOptions, setFilterOptions] = useState(searchParams);
  const router = useRouter();
  const searchString = getSearchString(searchParams);
  const previousSearchString = usePrevious(searchString);

  useEffect(() => {
    if (searchString === previousSearchString) return;
    setFilterOptions({ ...searchParams });
  }, [searchParams, previousSearchString, searchString]);

  const applyFilters = () => {
    const url = `/products${getSearchString(filterOptions)}`;
    const canStart = startRouteTransition(url);
    if (!canStart) return;
    router.push(url);
  };

  useTimeout(applyFilters, 250);

  const clearFilters = () => {
    setFilterOptions({
      title: filterOptions.title,
      category: '',
      pricegte: '',
      pricelte: '',
      sort: undefined
    });
  };

  const canClearFilters = !!getSearchString({ ...searchParams, title: '' });

  return (
    <div className="flex w-full flex-col space-y-7">
      <div className="flex items-center space-x-2 text-base font-medium">
        <Filter className="size-4" />
        <span>Filters</span>
      </div>

      <section className="flex flex-col space-y-2">
        <Label>Select a category</Label>
        <Select
          value={filterOptions.category || ''}
          onValueChange={(value) => {
            setFilterOptions({ ...filterOptions, category: value === 'all' ? '' : value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            {productsCategories.map((category) => (
              <SelectItem key={category.value} value={category.value} className="text-indigo-100">
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="flex flex-col space-y-2">
        <Label>Sort by</Label>
        <Select
          value={filterOptions.sort || ''}
          onValueChange={(value) =>
            setFilterOptions({
              ...filterOptions,
              sort: value as unknown as SearchProductsParams['sort']
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Default" />
          </SelectTrigger>

          <SelectContent>
            {productsResultSortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <span className="text-indigo-100">{option.title}</span>
                  <option.Icon className="size-3.5" />
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="flex flex-col space-y-4">
        <Label className="flex items-center justify-between font-medium">
          <span>Price</span>
          {`> ${formatPrice(Number(filterOptions.pricegte) || 5000)}`}
        </Label>

        <Slider
          min={5_000}
          max={10_00_000}
          value={[Number(filterOptions.pricegte) || 5000]}
          onValueChange={([value]) =>
            setFilterOptions({ ...filterOptions, pricegte: value.toString() })
          }
          step={500}
        />
      </section>

      <Button
        Icon={X}
        variant="outline"
        className="w-full"
        disabled={!canClearFilters}
        onClick={clearFilters}
      >
        Clear Filters
      </Button>
    </div>
  );
}