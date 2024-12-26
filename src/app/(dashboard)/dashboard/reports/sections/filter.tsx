'use client';
'use client';

import UserHoverCard from '@/components/cards/user-hover-card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Avatar from '@/components/utils/avatar';
import { useDebounce } from '@/hooks/use-debounce';
import { useWindowSize } from '@/hooks/use-window-size';
import { MILLIS } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { cn, isShallowEqual } from '@/lib/utils';
import { KeyOptions } from '@/queries/use-reports';
import { useUser, userKey } from '@/queries/use-user';
import { useUsers } from '@/queries/use-users';
import { createStore } from '@jodd/snap';
import { PopoverClose } from '@radix-ui/react-popover';
import dayjs from 'dayjs';
import {
  AlignLeftIcon,
  CalendarIcon,
  ChevronsUpDownIcon,
  FilterIcon,
  FilterXIcon,
  SearchIcon,
  XIcon
} from 'lucide-react';
import { useState } from 'react';

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
              className="flex items-center space-x-2 rounded-lg bg-brand/10 px-2.5 py-1 text-sm text-brand hover:bg-rose-400/10 hover:text-error"
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
  const [searchUserInput, setSearchUserInput] = useState('');
  const debouncedSearchUserInput = useDebounce(searchUserInput, 250);

  const { data: usersResult, isLoading: isLoadingUsers } = useUsers({
    q: debouncedSearchUserInput.trim()
  });
  const { data: user, isLoading: isLoadingUser } = useUser(filters.user!, {
    enabled: !!filters.user
  });

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0">
      <section className="flex flex-col space-y-2">
        <Label htmlFor="user">Select user</Label>
        <Popover>
          {!isLoadingUser && (
            <PopoverTrigger asChild>
              <button className="flex h-9 min-w-32 items-center justify-between rounded-md border px-3 text-sm">
                {!filters.user && <span className="mr-auto">All</span>}
                {filters.user && user && (
                  <div className="flex items-center space-x-2">
                    <Avatar src={user.image} size="xs" />
                    <span className="line-clamp-1">{user.name}</span>
                  </div>
                )}
                <ChevronsUpDownIcon className="ml-2 size-3 opacity-50" />
              </button>
            </PopoverTrigger>
          )}

          {filters.user && isLoadingUser && <Skeleton className="h-9 min-w-32" />}

          <PopoverContent className="text-sm">
            <Input
              placeholder="Search user..."
              IconLeft={SearchIcon}
              className="h-8"
              value={searchUserInput}
              onChange={(e) => setSearchUserInput(e.target.value)}
            />

            {!isLoadingUsers && usersResult?.length === 0 && (
              <p className="mt-2 text-error">No Results found.</p>
            )}

            <ScrollArea className="-mx-1 h-48">
              <section className="mt-3 flex flex-col space-y-1 px-1 pb-2">
                {isLoadingUsers &&
                  new Array(4)
                    .fill('nothing')
                    .map((_, i) => <Skeleton key={i} className="h-11 bg-indigo-300/10" />)}
                {usersResult?.map((user) => (
                  <PopoverClose key={user.id} asChild>
                    <button
                      onClick={() => {
                        getQueryClient().setQueryData<User>(userKey(user.id), {
                          ...user
                        });
                        useFilters.setState({ user: user.id });
                      }}
                      className={cn(
                        'flex items-center space-x-2 rounded-md px-2 py-1 ring-indigo-300/30 hover:bg-indigo-300/10 active:ring-1',
                        {
                          'bg-indigo-300/10 ring-1 ring-indigo-300/30': filters.user === user.id
                        }
                      )}
                    >
                      <Avatar src={user.image} size="sm" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </button>
                  </PopoverClose>
                ))}
              </section>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </section>

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
          value={typeof filters.responded === 'boolean' ? String(filters.responded) : 'all'}
          onValueChange={(val) =>
            useFilters.setState({
              responded: val === 'true' ? true : val === 'false' ? false : undefined
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
