'use client';
import { useLoadingBar } from '@/hooks/use-loading-bar';
import { useTimeout } from '@/hooks/use-timeout';
import { productsCategories } from '@/lib/constants';
import { formatPrice, getSearchString } from '@/lib/utils';
import { Filter, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';

export type SearchProductsParams = {
  title: string | undefined;
  category: string | undefined;
  pricegte: string | undefined;
  pricelte: string | undefined;
};
export default function ProductsFilterSidebar({
  searchParams
}: {
  searchParams: SearchProductsParams;
}) {
  const startRouteTransition = useLoadingBar((state) => state.start);
  const [filterOptions, setFilterOptions] = useState(searchParams);
  const router = useRouter();

  const applyFilters = useCallback(() => {
    const url = `/products${getSearchString(filterOptions)}`;
    startRouteTransition(url);
    router.push(url);
  }, [filterOptions, router, startRouteTransition]);

  useTimeout(applyFilters, 250);

  const clearFilters = () => {
    setFilterOptions({ title: filterOptions.title, category: '', pricegte: '', pricelte: '' });
  };

  useEffect(() => {
    setFilterOptions(searchParams);
  }, [searchParams]);

  const canClearFilters = useMemo(() => {
    return !!getSearchString({ ...searchParams, title: '' });
  }, [searchParams]);

  return (
    <div className="flex w-full flex-col space-y-7 p-4">
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
              <SelectItem key={category.value} value={category.value}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="flex flex-col space-y-4">
        <Label className="flex items-center justify-between font-semibold">
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
