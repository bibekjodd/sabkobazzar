'use client';

import { Button } from '@/components/ui/button';
import { auctionStatuses, productsCategories } from '@/lib/constants';
import { cn, isShallowEqual } from '@/lib/utils';
import { FilterXIcon } from 'lucide-react';
import { clearFilters, useFilters } from './filter';

export default function FilterSuggestions() {
  const filters = useFilters();

  const canClearFilters = !isShallowEqual(
    { ...filters, title: undefined },
    useFilters.getInitialState()
  );

  return (
    <div className="hidden items-center space-x-3 md:flex">
      <Button
        onClick={clearFilters}
        variant="outline"
        className={cn({
          'bg-foreground text-primary-foreground hover:bg-foreground hover:text-primary-foreground':
            !canClearFilters
        })}
      >
        All
      </Button>

      {auctionStatuses.map((status) => {
        if (status.value === 'cancelled') return null;
        return (
          <Button
            key={status.value}
            variant="outline"
            onClick={() =>
              useFilters.setState({
                status: filters.status === status.value ? undefined : status.value
              })
            }
            className={cn({
              'bg-foreground text-primary-foreground hover:bg-foreground hover:text-primary-foreground':
                filters.status === status.value
            })}
          >
            {status.title}
          </Button>
        );
      })}

      {productsCategories.map((category) => (
        <Button
          key={category.value}
          variant="outline"
          onClick={() =>
            useFilters.setState({
              category: filters.category === category.value ? undefined : category.value
            })
          }
          className={cn('hidden xl:flex', {
            'bg-foreground text-primary-foreground hover:bg-foreground hover:text-primary-foreground':
              filters.category === category.value
          })}
        >
          {category.title}
        </Button>
      ))}

      <Button
        disabled={!canClearFilters}
        variant="outline"
        onClick={clearFilters}
        className="flex items-center"
      >
        <span className="mr-2">Clear Filters</span>
        <FilterXIcon className="size-4" />
      </Button>
    </div>
  );
}
