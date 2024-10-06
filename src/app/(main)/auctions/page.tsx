'use client';
import AuctionCard, { auctionCardSkeleton } from '@/components/cards/auction-card';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { useUpcomingAuctions } from '@/queries/use-upcoming-auctions';
import React from 'react';

export default function Page() {
  const {
    data: upcomingAuctions,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isLoading
  } = useUpcomingAuctions({ ownerId: null, productId: null });
  return (
    <main className="relative min-h-screen overflow-hidden pb-20">
      <div className="fixed left-0 top-16 -z-10 h-screen w-full bg-gradient-to-b from-indigo-950/10" />
      <div className="fixed bottom-60 left-0 -z-10 size-80 rounded-full bg-indigo-500/10 blur-3xl filter" />
      <div className="fixed right-0 top-16 -z-10 size-60 rounded-full bg-violet-500/15 blur-3xl filter" />
      <div className="cont">
        <h3 className="mb-5 mt-7 px-4 text-2xl font-medium text-indigo-200">
          Upcoming Live Auctions
        </h3>
        <section className="grid md:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            new Array(6).fill('nothing').map((_, i) => (
              <div key={i} className="pb-5 md:px-5">
                {auctionCardSkeleton}
              </div>
            ))}
          {upcomingAuctions?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.map((auction) => (
                <div key={auction.id} className="pb-5 md:px-5">
                  <AuctionCard auction={auction} />
                </div>
              ))}
            </React.Fragment>
          ))}
        </section>
        <InfiniteScrollObserver
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          showLoader
        />
      </div>
    </main>
  );
}
