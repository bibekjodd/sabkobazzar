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
import { auctionProductConditions, auctionStatuses } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { cn, isShallowEqual } from '@/lib/utils';
import { KeyOptions } from '@/queries/use-auctions';
import { useProfile } from '@/queries/use-profile';
import { useUser, userKey } from '@/queries/use-user';
import { useUsers } from '@/queries/use-users';
import { createStore } from '@jodd/snap';
import { PopoverClose } from '@radix-ui/react-popover';
import dayjs from 'dayjs';
import {
  CalendarIcon,
  ChevronsUpDownIcon,
  FilterXIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  UserRoundIcon
} from 'lucide-react';
import { useState } from 'react';

export const useFilters = createStore<KeyOptions>(() => ({}));
export const clearFilters = () => {
  const clearedState = { ...useFilters.getState() };
  for (const key of Object.keys(clearedState)) {
    // @ts-expect-error ...
    clearedState[key] = undefined;
  }
  useFilters.setState({ ...clearedState });
};

export default function Filter() {
  const filters = useFilters();
  const { data: profile } = useProfile();
  const [searchHostInput, setSearchHostInput] = useState('');

  const debouncedSearchHostInput = useDebounce(searchHostInput, 250);
  const canClearFilters = !isShallowEqual(
    {
      ...filters,
      owner: profile?.role === 'admin' ? filters.owner : undefined,
      resource: undefined
    },
    {
      ...useFilters.getInitialState(),
      owner: undefined,
      resource: undefined
    }
  );

  const { data: host, isLoading: isLoadingHost } = useUser(filters.owner!, {
    enabled: !!filters.owner
  });

  const { data: usersResult, isLoading: isLoadingUsers } = useUsers({
    q: debouncedSearchHostInput.trim(),
    role: 'user'
  });

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
            {profile?.role === 'admin' && (
              <section className="flex flex-col">
                <Label htmlFor="host" className="mb-1">
                  Select Host
                </Label>

                {filters.owner && isLoadingHost && <Skeleton className="h-9" />}

                {!isLoadingHost && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        id="host"
                        className="flex h-9 items-center justify-between rounded-md border px-3 text-sm ring-ring focus:ring-1"
                      >
                        <div className="flex items-center space-x-2">
                          {!host && <UserRoundIcon className="size-3.5" />}
                          {host && <Avatar src={host.image} size="xs" />}
                          <p>{host?.name || 'None'}</p>
                        </div>

                        <ChevronsUpDownIcon className="size-3 opacity-50" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="bg-purple-800/10">
                      <Input
                        placeholder="Search host..."
                        IconLeft={SearchIcon}
                        value={searchHostInput}
                        onChange={(e) => setSearchHostInput(e.target.value)}
                        className="h-8"
                      />
                      {!isLoadingUsers && usersResult && usersResult.length === 0 && (
                        <p className="mt-2 text-sm text-error">No results found.</p>
                      )}

                      <ScrollArea className="-mx-1 h-48">
                        <section className="mt-3 flex flex-col space-y-1 px-1">
                          {isLoadingUsers &&
                            new Array(4)
                              .fill('nothing')
                              .map((_, i) => (
                                <Skeleton key={i} className="h-11 bg-indigo-300/10" />
                              ))}
                          {usersResult?.map((user) => (
                            <PopoverClose key={user.id} asChild>
                              <button
                                onClick={() => {
                                  getQueryClient().setQueryData<User>(userKey(user.id), {
                                    ...user
                                  });
                                  useFilters.setState({ owner: user.id });
                                }}
                                className={cn(
                                  'flex items-center space-x-2 rounded-md px-2 py-1 ring-indigo-300/30 hover:bg-indigo-300/10 active:ring-1',
                                  {
                                    'bg-indigo-300/10 ring-1 ring-indigo-300/30':
                                      filters.owner === user.id
                                  }
                                )}
                              >
                                <Avatar src={user.image} size="sm" />

                                <div className="flex flex-col items-start">
                                  <span className="text-sm">{user.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {user.email}
                                  </span>
                                </div>
                              </button>
                            </PopoverClose>
                          ))}
                        </section>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                )}
              </section>
            )}

            <section className="space-y-1">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={filters.condition || 'all'}
                onValueChange={(value) =>
                  useFilters.setState({
                    condition: value === 'all' ? undefined : (value as KeyOptions['condition'])
                  })
                }
              >
                <SelectTrigger className="w-full" id="condition">
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) =>
                  useFilters.setState({
                    status: value === 'all' ? undefined : (value as KeyOptions['status'])
                  })
                }
              >
                <SelectTrigger className="w-full" id="status">
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
                      useFilters.setState({
                        from,
                        to: from === to ? undefined : to
                      });
                    }}
                  />
                </PopoverContent>
              </Popover>
            </section>

            <Button
              variant="outline"
              disabled={!canClearFilters}
              onClick={clearFilters}
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
        onClick={clearFilters}
        disabled={!canClearFilters}
        className="hidden items-center md:flex"
      >
        <span className="mr-2 hidden xl:inline">Clear Filters</span>
        <FilterXIcon className="size-4" />
      </Button>
    </div>
  );
}
