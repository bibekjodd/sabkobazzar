'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { extractErrorMessage } from '@/lib/utils';
import { useAuction } from '@/queries/use-auction';
import { loadAuction } from '@/stores/use-auction-store';
import { CircleAlert } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import AuctionOverview, { auctionOverviewSkeleton } from './sections/auction-overview';
import MoreAuctions from './sections/more-auctions';

export const dynamic = 'force-static';

export default function Page() {
  const { id: auctionId } = useParams<{ id: string }>();
  const { data: auction, error, isLoading } = useAuction(auctionId);

  useEffect(() => {
    loadAuction(auction || null);
  }, [auction]);

  useEffect(() => {
    return () => {
      loadAuction(null);
    };
  }, []);

  return (
    <main className="min-h-screen pb-20 pt-28 md:pt-16">
      {graphics}

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

      <div className="cont text-muted-foreground">
        {auction && (
          <div className="grid min-h-[calc(100vh-80px)] place-items-center py-7">
            <AuctionOverview auction={auction} />
          </div>
        )}

        {auction && <MoreAuctions currentAuction={auction} />}
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
