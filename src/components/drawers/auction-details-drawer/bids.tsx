import UserHoverCard from '@/components/cards/user-hover-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import Avatar from '@/components/utils/avatar';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { extractErrorMessage, formatPrice } from '@/lib/utils';
import { useBids } from '@/queries/use-bids';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { CheckIcon, CircleAlertIcon, HistoryIcon, ListFilterIcon } from 'lucide-react';
import { useState } from 'react';

dayjs.extend(durationPlugin);

export function Bids({ auctionId, startDate }: { auctionId: string; startDate: string }) {
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  const {
    data: bids,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    error
  } = useBids({
    auctionId,
    sort
  });

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          <HistoryIcon className="mr-2 inline size-4" />
          <span>Bids History</span>
        </h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 text-sm">
              <ListFilterIcon className="size-4" />
              <span>{sort === 'asc' ? 'Show from the start' : 'Show from the end'}</span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-40">
            <DropdownMenuItem className="flex justify-between" onClick={() => setSort('asc')}>
              <span>From the start</span>

              {sort === 'asc' && <CheckIcon />}
            </DropdownMenuItem>

            <DropdownMenuItem className="flex justify-between" onClick={() => setSort('desc')}>
              <span>From the end</span>
              {sort === 'desc' && <CheckIcon />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3">
        {error && (
          <Alert variant="destructive">
            <CircleAlertIcon className="size-4" />
            <AlertTitle>Could not get bids result</AlertTitle>
            <AlertDescription>{extractErrorMessage(error)}</AlertDescription>
          </Alert>
        )}

        {isLoading &&
          new Array(4)
            .fill('nothing')
            .map((_, i) => <Skeleton key={i} className="-mx-3 mb-1 h-16" />)}

        {!isLoading && bids?.length === 0 && (
          <p className="mt-4 text-center text-sm text-rose-500">No results to show</p>
        )}

        {bids?.map((bid) => <BidItem key={bid.id} bid={bid} startDate={startDate} />)}
      </div>

      <InfiniteScrollObserver
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
      />
    </section>
  );
}

function BidItem({ bid, startDate }: { bid: Bid; startDate: string }) {
  const duration = dayjs.duration(dayjs(bid.createdAt).diff(dayjs(startDate)));
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  return (
    <div className="-mx-3 mb-1 rounded-md border-indigo-200/10 bg-indigo-900/10 py-1.5 last:border-b-0">
      <div className="px-4 py-2">
        <p className="text-xs text-indigo-100/80">
          At {minutes !== 0 && `${minutes} minutes`} {seconds && `${seconds} seconds`}
        </p>

        <div className="mt-2.5 flex items-center justify-between">
          <UserHoverCard user={bid.bidder}>
            <div className="flex items-center space-x-2 hover:underline">
              <Avatar src={bid.bidder.image} size="sm" />
              <p className="text-sm">{bid.bidder.name}</p>
            </div>
          </UserHoverCard>
          <p className="ml-auto font-medium text-purple-400/90">{formatPrice(bid.amount)}</p>
        </div>
      </div>
    </div>
  );
}
