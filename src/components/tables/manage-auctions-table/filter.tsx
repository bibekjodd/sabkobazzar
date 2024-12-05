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
import { auctionProductConditions, auctionStatuses } from '@/lib/constants';
import { KeyOptions } from '@/queries/use-auctions';
import dayjs from 'dayjs';
import { CalendarIcon, FilterXIcon, SlidersHorizontalIcon } from 'lucide-react';
import React from 'react';

type Props = {
  setFilters: React.Dispatch<React.SetStateAction<KeyOptions>>;
  filters: KeyOptions;
};

export default function Filter({ filters, setFilters }: Props) {
  return (
    <div className="flex flex-grow items-center space-x-3 lg:space-x-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <span className="mr-2 hidden xl:inline"> Filters</span>
            <SlidersHorizontalIcon className="size-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="min-w-44">
          <div className="flex flex-col space-y-4">
            <section className="space-y-1">
              <Label>Condition</Label>
              <Select
                value={filters.condition || 'all'}
                onValueChange={(value) =>
                  setFilters((options) => ({
                    ...options,
                    condition: value as KeyOptions['condition']
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>

                <SelectContent className="bg-background/40 filter backdrop-blur-3xl">
                  <SelectItem value="all">All</SelectItem>
                  {auctionProductConditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.title}
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
                  setFilters((options) => ({
                    ...options,
                    status: value as KeyOptions['status']
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>

                <SelectContent className="bg-background/40 filter backdrop-blur-3xl">
                  <SelectItem value="all">All</SelectItem>
                  {auctionStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            <section className="flex flex-col space-y-1">
              <Label className="mb-1">Range</Label>
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

                <PopoverContent className="bg-background/40 filter backdrop-blur-3xl">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={{
                      from: filters.from ? new Date(filters.from) : undefined,
                      to: filters.to ? new Date(filters.to) : undefined
                    }}
                    onSelect={(range) => {
                      const from = range?.from?.toISOString();
                      const to = range?.to?.toISOString();
                      setFilters((options) => ({
                        ...options,
                        from,
                        to: from === to ? undefined : to
                      }));
                    }}
                  />
                </PopoverContent>
              </Popover>
            </section>

            <Button
              variant="outline"
              onClick={() =>
                setFilters((options) => ({ owner: options.owner, title: options.title }))
              }
              className="!mt-2 flex items-center md:hidden"
            >
              <span className="mr-2">Clear Filters</span>
              <FilterXIcon className="size-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        onClick={() => setFilters((options) => ({ owner: options.owner, title: options.title }))}
        className="hidden items-center md:flex"
      >
        <span className="mr-2 hidden xl:inline">Clear Filters</span>
        <FilterXIcon className="size-4" />
      </Button>
    </div>
  );
}
