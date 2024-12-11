'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { usePrevious } from '@/hooks/use-previous';
import { auctionProductConditions, auctionStatuses, productsCategories } from '@/lib/constants';
import { cn, getSearchString } from '@/lib/utils';
import { KeyOptions } from '@/queries/use-auctions';
import {
  AuctionsFilterParams,
  clearFilterAuctions,
  updateFilterAuctions,
  updateInitialFilterAuctions,
  useFilterAuctions
} from '@/stores/use-filter-auctions';
import { useLoadingBar } from '@jodd/next-top-loading-bar';
import { PopoverClose } from '@radix-ui/react-popover';
import {
  CheckCheckIcon,
  CircleCheckBigIcon,
  CircleDotDashedIcon,
  CircleGaugeIcon,
  CircleOffIcon,
  ClockIcon,
  FilterXIcon,
  RadioIcon,
  SlidersHorizontalIcon
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function Filter() {
  const searchParams = useSearchParams();
  const currentSearchParams: AuctionsFilterParams = useMemo(
    () => ({
      category: searchParams.get('category') as KeyOptions['category'],
      owner: searchParams.get('owner'),
      sort: searchParams.get('sort') as KeyOptions['sort'],
      status: searchParams.get('status') as KeyOptions['status'],
      title: searchParams.get('title'),
      condition: searchParams.get('condition') as KeyOptions['condition']
    }),
    [searchParams]
  );

  useEffect(() => {
    updateInitialFilterAuctions(currentSearchParams);
  }, [currentSearchParams]);

  const filters = useFilterAuctions((state) => state.filters);
  const router = useRouter();
  const currentSearchString = getSearchString(filters);
  const previousSearchString = usePrevious(currentSearchString);

  useEffect(() => {
    if (currentSearchString === previousSearchString || previousSearchString === null) return;

    const timeout = setTimeout(() => {
      const nextRoute = `/auctions${currentSearchString}`;
      const canStart = useLoadingBar.getState().start(nextRoute);
      if (canStart) router.push(nextRoute);
    }, 200);

    return () => clearTimeout(timeout);
  }, [currentSearchParams, currentSearchString, previousSearchString, router]);

  const isAppliedFilters = !!getSearchString({ ...filters, title: undefined });

  return (
    <div className="flex space-x-3 py-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" Icon={SlidersHorizontalIcon}>
            Filters
          </Button>
        </PopoverTrigger>

        <PopoverContent className="min-w-44">
          <div className="flex flex-col space-y-4">
            <section className="space-y-1">
              <Label>Condition</Label>
              <Select
                value={filters.condition || 'all'}
                onValueChange={(value) =>
                  updateFilterAuctions({
                    ...filters,
                    condition: value as KeyOptions['condition']
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>

                <SelectContent className="bg-background/40 filter backdrop-blur-3xl">
                  <SelectItem value="all">All</SelectItem>
                  {auctionProductConditions.map((condition) => (
                    <SelectItem
                      key={condition.value}
                      value={condition.value}
                      className="flex items-center"
                    >
                      {condition.value === 'new' && (
                        <CircleCheckBigIcon className="mr-1.5 inline size-3.5 translate-y-[-1px]" />
                      )}
                      {condition.value === 'first-class' && (
                        <CircleGaugeIcon className="mr-1.5 inline size-3.5 translate-y-[-1px]" />
                      )}
                      {condition.value === 'repairable' && (
                        <CircleDotDashedIcon className="mr-1.5 inline size-3.5 translate-y-[-1px]" />
                      )}
                      <span>{condition.title}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            <section className="space-y-1">
              <Label>Status</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) =>
                  updateFilterAuctions({
                    ...filters,
                    status: value as KeyOptions['status']
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {auctionStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.value === 'pending' && (
                        <ClockIcon className="mr-1.5 inline size-3.5 translate-y-[-1px]" />
                      )}
                      {status.value === 'live' && (
                        <RadioIcon className="mr-1.5 inline size-3.5 translate-y-[-1px]" />
                      )}
                      {status.value === 'cancelled' && (
                        <CircleOffIcon className="mr-1.5 inline size-3.5 translate-y-[-1px]" />
                      )}
                      {status.value === 'completed' && (
                        <CheckCheckIcon className="mr-1.5 inline size-3.5 translate-y-[-1px]" />
                      )}
                      <span>{status.title}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            <PopoverClose asChild>
              <Button
                disabled={!isAppliedFilters}
                variant="outline"
                onClick={clearFilterAuctions}
                className="!mt-2 flex items-center"
              >
                <span className="mr-2">Clear Filters</span>
                <FilterXIcon className="size-4" />
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>

      <div className="hidden items-center space-x-3 md:flex">
        <Button
          onClick={clearFilterAuctions}
          variant="outline"
          className={cn({
            'bg-indigo-100 text-primary-foreground hover:bg-indigo-100 hover:text-primary-foreground':
              !isAppliedFilters
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
                updateFilterAuctions({
                  ...filters,
                  status: filters.status === status.value ? undefined : status.value
                })
              }
              className={cn({
                'bg-indigo-100 text-primary-foreground hover:bg-indigo-100 hover:text-primary-foreground':
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
              updateFilterAuctions({
                ...filters,
                category: filters.category === category.value ? undefined : category.value
              })
            }
            className={cn('hidden xl:flex', {
              'bg-indigo-100 text-primary-foreground hover:bg-indigo-100 hover:text-primary-foreground':
                filters.category === category.value
            })}
          >
            {category.title}
          </Button>
        ))}

        <Button
          disabled={!isAppliedFilters}
          variant="outline"
          onClick={clearFilterAuctions}
          className="flex items-center"
        >
          <span className="mr-2">Clear Filters</span>
          <FilterXIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
