'use client';

import AuctionCard, { auctionCardSkeleton } from '@/components/cards/auction-card';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { useAuctions } from '@/queries/use-auctions';
import { useFilters } from './filter';

export default function SearchResult() {
  const filters = useFilters();
  const {
    data: auctions,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isLoading
  } = useAuctions(filters);

  return (
    <div>
      {!isLoading && auctions?.length === 0 && (
        <p className="p-4 font-medium text-error">No Results found</p>
      )}

      <div className="grid gap-x-4 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          new Array(6).fill('nothing').map((_, i) => <div key={i}>{auctionCardSkeleton}</div>)}
        {auctions?.map((auction) => <AuctionCard key={auction.id} auction={auction} />)}
      </div>

      <div className="pt-4">
        <InfiniteScrollObserver
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}
