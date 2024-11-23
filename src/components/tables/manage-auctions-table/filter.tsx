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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { productConditions } from '@/lib/constants';
import { KeyOptions } from '@/queries/use-auctions';
import dayjs from 'dayjs';
import { CalendarIcon, FilterIcon, FilterXIcon, SlidersHorizontalIcon } from 'lucide-react';
import React from 'react';

type Props = {
  setFilters: React.Dispatch<React.SetStateAction<KeyOptions>>;
  filters: KeyOptions;
};

const auctionStatuses = [
  { title: 'Pending', value: 'pending' },
  { title: 'Finished', value: 'finished' },
  { title: 'Cancelled', value: 'cancelled' }
];

export default function Filter({ filters, setFilters }: Props) {
  return (
    <>
      {/* mobile screens */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="aspect-video md:hidden">
            <SlidersHorizontalIcon />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="flex w-[calc(100%-20px)] max-w-80 flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <FilterIcon className="size-4" />
              <span className="text-base">Filters</span>
            </SheetTitle>
          </SheetHeader>
          <SheetDescription className="sr-only" />
          <BaseFilter filters={filters} setFilters={setFilters} />
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* tablet and large screens */}
      <div className="hidden md:block">
        <BaseFilter filters={filters} setFilters={setFilters} />
      </div>
    </>
  );
}

function BaseFilter({ filters, setFilters }: Props) {
  return (
    <div className="flex flex-grow flex-col space-y-5 md:flex-row md:items-end md:space-x-3 md:space-y-0 lg:space-x-4">
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
          <SelectTrigger className="md:w-28 xl:w-40">
            <SelectValue placeholder="All" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {productConditions.map((condition) => (
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
          <SelectTrigger className="md:w-28 xl:w-40">
            <SelectValue placeholder="All" />
          </SelectTrigger>

          <SelectContent>
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
            <Button variant="outline" Icon={CalendarIcon} className="min-w-32">
              {!filters.from && !filters.to && 'All time'}
              {filters?.from && dayjs(filters.from).format('MMM DD, YYYY').toString()}{' '}
              {filters?.from && filters?.to && ' - '}
              {filters?.to && dayjs(filters.to).format('MMM DD, YYYY')}
            </Button>
          </PopoverTrigger>

          <PopoverContent>
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
                setFilters((options) => ({ ...options, from, to: from === to ? undefined : to }));
              }}
            />
          </PopoverContent>
        </Popover>
      </section>

      <Button
        variant="outline"
        onClick={() => setFilters((options) => ({ owner: options.owner, title: options.title }))}
        className="flex items-center"
      >
        <span className="mr-2 md:hidden xl:inline">Clear Filters</span>
        <FilterXIcon className="size-4" />
      </Button>
    </div>
  );
}
