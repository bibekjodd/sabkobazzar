'use client';
'use client';

import UserHoverCard from '@/components/cards/user-hover-card';
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
import { Skeleton } from '@/components/ui/skeleton';
import Avatar from '@/components/utils/avatar';
import { useWindowSize } from '@/hooks/use-window-size';
import { MILLIS } from '@/lib/constants';
import { isShallowEqual } from '@/lib/utils';
import { KeyOptions } from '@/queries/use-reports';
import { useUser } from '@/queries/use-user';
import { createStore } from '@jodd/snap';
import dayjs from 'dayjs';
import { AlignLeftIcon, CalendarIcon, FilterIcon, FilterXIcon, XIcon } from 'lucide-react';

const initialState: KeyOptions = {
  auction: undefined,
  from: undefined,
  to: undefined,
  limit: undefined,
  responded: 'all',
  sort: 'desc',
  user: undefined
};
export const useFilters = createStore<KeyOptions>(() => initialState);
export const clearFilters = () => useFilters.setState(initialState);

export default function Filter() {
  const { width: windowWidth } = useWindowSize();
  const auctionId = useFilters((state) => state.auction);
  const userId = useFilters((state) => state.user);
  const { data: user, isLoading: isLoadingUser } = useUser(userId!, { enabled: !!userId });

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

      {(userId || auctionId) && (
        <div className="my-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          {userId && isLoadingUser && <Skeleton className="h-7 w-44 rounded-lg" />}
          {user && (
            <button
              onClick={() => useFilters.setState({ user: undefined })}
              className="flex items-center space-x-2 rounded-lg bg-purple-400/10 px-2.5 py-1 text-sm text-purple-400 hover:bg-rose-400/10 hover:text-rose-400"
            >
              <span>Viewing all reports from user</span>
              <UserHoverCard user={user}>
                <Avatar src={user?.image} size="xs" />
              </UserHoverCard>
              <XIcon className="size-3.5" />
            </button>
          )}
          {auctionId && (
            <button
              onClick={() => useFilters.setState({ auction: undefined })}
              className="flex items-center space-x-2 rounded-lg bg-teal-400/10 px-2.5 py-1 text-sm text-teal-400 hover:bg-teal-400/20"
            >
              <span>Show for all auctions</span>
              <AlignLeftIcon className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function BaseFilter() {
  const filters = useFilters();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0">
      <section className="flex flex-col space-y-2">
        <Label htmlFor="sort">Sort by</Label>
        <Select
          value={filters.sort}
          onValueChange={(val) => useFilters.setState({ sort: val as KeyOptions['sort'] })}
        >
          <SelectTrigger id="sort" className="min-w-32">
            <SelectValue placeholder="Most recent" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="desc">Most recent</SelectItem>
            <SelectItem value="asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="flex flex-col space-y-2">
        <Label htmlFor="range">Range</Label>
        <Popover>
          <PopoverTrigger asChild id="range">
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

      <section className="flex flex-col space-y-2">
        <Label htmlFor="response">Response</Label>
        <Select
          value={filters.responded || 'all'}
          onValueChange={(val) =>
            useFilters.setState({
              responded: val as KeyOptions['responded']
            })
          }
        >
          <SelectTrigger id="response" className="min-w-32">
            <SelectValue placeholder="All" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Responded</SelectItem>
            <SelectItem value="false">Unresponded</SelectItem>
          </SelectContent>
        </Select>
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
