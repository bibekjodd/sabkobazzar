'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { extractErrorMessage } from '@/lib/utils';
import { useLeaveLiveAuction } from '@/mutations/use-leave-live-auction';
import { useAuction } from '@/queries/use-auction';
import { useAuctionStore } from '@/stores/use-auction-store';
import { CircleAlert } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import AuctionOverview, { auctionOverviewSkeleton } from './sections/auction-overview';
import Live from './sections/live';
import MoreAuctions from './sections/more-auctions';

export const dynamic = 'force-static';

export default function Page() {
  const { id: auctionId } = useParams<{ id: string }>();
  const { data: auction, error, isLoading } = useAuction(auctionId);
  const { mutate: leaveLiveAuction } = useLeaveLiveAuction(auctionId);
  const isLive = useAuctionStore((state) => state.isLive);
  const isLivePrevious = useAuctionStore((state) => state.isLivePrevious);

  useEffect(() => {
    return () => {
      if (isLive) leaveLiveAuction();
    };
  }, [leaveLiveAuction, isLive]);

  const showLive = isLive || isLivePrevious;

  useEffect(() => {
    useAuctionStore.getState().onAuctionChange(auction || null);
  }, [auction]);

  useEffect(() => {
    return () => {
      useAuctionStore.getState().onAuctionChange(null);
    };
  }, []);

  return (
    <main className="min-h-screen pb-20 pt-28 md:pt-16">
      {!showLive && graphics}

      {error && (
        <div className="p-4">
          <Alert variant="destructive" className="bg-destructive/10">
            <CircleAlert className="size-4" />
            <AlertTitle>Could not get auctions details!</AlertTitle>
            <AlertDescription>{extractErrorMessage(error)}</AlertDescription>
          </Alert>
        </div>
      )}

      {isLoading && (
        <div className="grid min-h-[calc(100vh-80px)] place-items-center py-7">
          {auctionOverviewSkeleton}
        </div>
      )}

      {showLive && auction && <Live auction={auction} />}

      <div className="cont text-muted-foreground">
        {auction && !showLive && (
          <div className="grid min-h-[calc(100vh-80px)] place-items-center py-7">
            <AuctionOverview auction={auction} />
          </div>
        )}

        {!isLive && auction && <MoreAuctions currentAuction={auction} />}
      </div>
    </main>
  );
}

const graphics = (
  <>
    <div className="fixed right-5 top-16 -z-10 size-40 rounded-full bg-brand-darker/10 blur-3xl filter md:size-80" />
    <div className="fixed left-5 top-16 -z-10 size-40 rounded-full bg-sky-500/15 blur-3xl filter md:size-80" />
  </>
);
