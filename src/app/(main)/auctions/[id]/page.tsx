'use client';

import AuctionOverview, { auctionOverviewSkeleton } from '@/components/auction-overview';
import AuctionCard from '@/components/cards/auction-card';
import Live from '@/components/live';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { extractErrorMessage } from '@/lib/utils';
import { useLeaveLiveAuction } from '@/mutations/use-leave-live-auction';
import { useAuction } from '@/queries/use-auction';
import { useAuctions } from '@/queries/use-auctions';
import { useAuctionStore } from '@/stores/use-auction-store';
import { ActivityIcon, CircleAlert } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export const dynamic = 'force-static';

export default function Client() {
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
    <main className="min-h-screen pb-20 pt-16">
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

      <div className="cont text-indigo-200">
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

function MoreAuctions({ currentAuction }: { currentAuction: Auction }) {
  const { data } = useAuctions({});

  const auctions = data?.filter((auction) => auction.id !== currentAuction.id);

  return (
    <section className="relative z-10 scroll-m-20 pt-16" id="upcoming-auctions">
      <h3 className="flex items-center space-x-2 px-2 text-2xl font-medium xs:text-3xl">
        <span className="">Explore more auctions</span>
        <ActivityIcon className="size-6 text-purple-600 xs:size-7" />
      </h3>

      <div className="mt-4 flex flex-wrap">
        {auctions?.slice(0, 6).map((auction) => (
          <div key={auction.id} className="mb-7 w-full md:w-1/2 md:p-4 xl:w-1/3">
            <AuctionCard auction={auction} />
          </div>
        ))}
      </div>
    </section>
  );
}

const graphics = (
  <>
    <div className="fixed right-5 top-16 -z-10 size-40 rounded-full bg-purple-500/10 blur-3xl filter md:size-80" />
    <div className="fixed left-5 top-16 -z-10 size-40 rounded-full bg-sky-500/15 blur-3xl filter md:size-80" />
  </>
);
