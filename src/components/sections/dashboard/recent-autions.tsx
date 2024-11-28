'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeUp } from '@/components/utils/animations';
import Avatar from '@/components/utils/avatar';
import { formatPrice } from '@/lib/utils';
import { useAuctions } from '@/queries/use-auctions';
import { useProfile } from '@/queries/use-profile';
import { ProgressLink } from '@jodd/next-top-loading-bar';
import dayjs from 'dayjs';
import { ChevronRightIcon, CircleAlertIcon, InfoIcon } from 'lucide-react';

export default function RecentAuctions() {
  const { data: profile } = useProfile();
  const { data, isLoading, error } = useAuctions({
    owner: profile?.id,
    status: 'completed',
    sort: 'starts_at_desc'
  });
  const recentAuctions = (data?.pages.map((page) => page.auctions).flat(1) || [])
    .filter((auction) => !!auction.winner)
    .slice(0, 4);

  return (
    <FadeUp className="w-full self-stretch rounded-lg bg-indigo-900/10 p-6 2xl:w-[600px]">
      <div className="flex items-center justify-between">
        <h3>Recent Auctions</h3>
        {recentAuctions.length !== 0 && (
          <ProgressLink
            href="/dashboard/auctions"
            className="flex items-center space-x-1 rounded-full border border-indigo-500/5 bg-indigo-200/5 px-2 py-1 text-xs hover:bg-indigo-200/10"
          >
            <span>See more</span>
            <ChevronRightIcon className="size-3" />
          </ProgressLink>
        )}
      </div>
      {!isLoading && recentAuctions.length === 0 && (
        <p className="mt-1 text-sm text-indigo-200/70">
          <InfoIcon className="mr-0.5 inline size-3 -translate-y-0.5" />{' '}
          <span>No data to show here</span>
        </p>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <CircleAlertIcon className="size-4" />
          <AlertTitle>Could not recent auctions data</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col">
        {isLoading &&
          new Array(4).fill('nothing').map((_, i) => (
            <div key={i} className="my-4 flex items-center gap-x-4">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-9 flex-grow" />
            </div>
          ))}

        {recentAuctions.map((auction) => (
          <div
            key={auction.id}
            className="border-b border-gray-400/15 py-4 last:border-none last:pb-0"
          >
            <p className="mb-2 text-xs text-indigo-100/75">
              {dayjs(auction.startsAt).format('MMMM DD')}
            </p>
            <div key={auction.id} className="flex items-center gap-x-4">
              <Avatar src={auction.winner?.image} />
              <div>
                <p className="text-sm">{auction.winner?.name}</p>
                <p className="text-xs text-indigo-100/75">{auction.winner?.email}</p>
              </div>

              <p className="ml-auto w-fit text-sm font-medium xs:text-base">
                {formatPrice(auction.finalBid || 0)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </FadeUp>
  );
}