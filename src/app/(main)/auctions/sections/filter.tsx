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
import { auctionProductConditions, auctionStatuses } from '@/lib/constants';
import { getSearchString, isShallowEqual } from '@/lib/utils';
import { KeyOptions } from '@/queries/use-auctions';
import { useLoadingBar } from '@jodd/next-top-loading-bar';
import { createStore } from '@jodd/snap';
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
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useFilters = createStore<KeyOptions>(() => ({}));
export const clearFilters = () => {
  const clearedState = { ...useFilters.getState() };
  for (const key of Object.keys(clearedState)) {
    // @ts-expect-error ...
    clearedState[key] = undefined;
  }
  useFilters.setState({ ...clearedState, title: useFilters.getState().title });
};

export default function Filter() {
  const filters = useFilters();
  const router = useRouter();
  useEffect(() => {
    const startRouteTransition = useLoadingBar.getState().start;
    const nextRoute = `/auctions/${getSearchString(filters)}`;
    if (startRouteTransition(nextRoute)) router.push(nextRoute);
  }, [filters, router]);

  const canClearFilters = !isShallowEqual(
    { ...filters, title: undefined },
    useFilters.getInitialState()
  );

  return (
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
                useFilters.setState({
                  condition: value === 'all' ? undefined : (value as KeyOptions['condition'])
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
                useFilters.setState({
                  status: value === 'all' ? undefined : (value as KeyOptions['status'])
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
              disabled={!canClearFilters}
              variant="outline"
              onClick={clearFilters}
              className="!mt-2 flex items-center"
            >
              <span className="mr-2">Clear Filters</span>
              <FilterXIcon className="size-4" />
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
