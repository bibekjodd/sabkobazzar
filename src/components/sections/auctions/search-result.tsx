'use client';

import AuctionCard from '@/components/cards/auction-card';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { useAuctions } from '@/queries/use-auctions';
import { useFilterAuctions } from '@/stores/use-filter-auctions';
import React from 'react';

export default function SearchResult() {
  const filters = useFilterAuctions((state) => state.filters);
  const { data, isFetching, fetchNextPage, hasNextPage, isLoading } = useAuctions(filters);

  return (
    <div>
      {!isLoading && data?.pages[0].auctions.length === 0 && (
        <p className="p-4 font-medium text-rose-500">No Results found</p>
      )}

      <div className="grid gap-x-4 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <InfiniteScrollObserver
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
      />
    </div>
  );
}
