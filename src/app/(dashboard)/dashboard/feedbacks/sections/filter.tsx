'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useWindowSize } from '@/hooks/use-window-size';
import { MILLIS } from '@/lib/constants';
import { isShallowEqual } from '@/lib/utils';
import { KeyOptions } from '@/queries/use-feedbacks';
import { createStore } from '@jodd/snap';
import dayjs from 'dayjs';
import { CalendarIcon, FilterIcon, FilterXIcon } from 'lucide-react';

const initialState: KeyOptions = {
  sort: 'desc'
};
export const useFilters = createStore<KeyOptions>(() => initialState);
export const clearFilters = () => {
  const clearedState = { ...useFilters.getState() };
  for (const key of Object.keys(clearedState)) {
    // @ts-expect-error ...
    clearedState[key] = undefined;
  }
  useFilters.setState({ ...clearedState });
};

export default function Filter() {
  const { width: windowWidth } = useWindowSize();
  return (
    <section className="mt-4 sm:space-y-3 lg:mt-0">
      <div className="hidden items-center space-x-2 font-medium sm:flex">
        <FilterIcon className="size-4" />
        <p>Filters</p>
      </div>

      {windowWidth < 640 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button Icon={FilterIcon} variant="outline">
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <BaseFilter />
          </PopoverContent>
        </Popover>
      )}
      {windowWidth >= 640 && <BaseFilter />}
    </section>
  );
}

function BaseFilter() {
  const filters = useFilters();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0">
      <section className="flex flex-col space-y-2">
        <Label>Ratings</Label>
        <Select
          value={filters.rating?.toString() || 'all'}
          onValueChange={(val) =>
            useFilters.setState({ rating: val === 'all' ? undefined : Number(val) })
          }
        >
          <SelectTrigger className="min-w-32">
            <SelectValue placeholder="All" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {new Array(5).fill('nothing').map((_, i) => (
              <SelectItem key={i} value={(i + 1).toString()}>
                {i + 1} stars
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="flex flex-col space-y-2">
        <Label>Sort by</Label>
        <Select
          value={filters.sort}
          onValueChange={(val) => useFilters.setState({ sort: val as 'asc' | 'desc' })}
        >
          <SelectTrigger className="min-w-32">
            <SelectValue placeholder="Most recent" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="desc">Most recent</SelectItem>
            <SelectItem value="asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="flex flex-col space-y-2">
        <Label>Range</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" Icon={CalendarIcon}>
              {!filters.from && !filters.to && 'All time'}
              {filters.from && !filters.to && 'From '}
              {filters?.from && dayjs(filters.from).format('MMM DD, YYYY').toString()}{' '}
              {filters?.from && filters?.to && ' - '}
              {filters?.to && dayjs(filters.to).format('MMM DD, YYYY')}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="range"
              selected={{
                from: filters.from ? new Date(filters.from) : undefined,
                to: filters.to ? new Date(filters.to) : undefined
              }}
              onSelect={(range) => {
                useFilters.setState({
                  from: range?.from?.toISOString(),
                  to: range?.to?.toISOString()
                });
              }}
              fromDate={new Date(Date.now() - MILLIS.MONTH * 12)}
              toDate={new Date()}
            />
          </PopoverContent>
        </Popover>
      </section>

      <Button
        disabled={isShallowEqual(filters, useFilters.getInitialState())}
        variant="outline"
        Icon={FilterXIcon}
        onClick={clearFilters}
      >
        Clear Filters
      </Button>
    </div>
  );
}
