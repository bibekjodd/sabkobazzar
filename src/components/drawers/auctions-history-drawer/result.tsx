import { Skeleton } from '@/components/ui/skeleton';
import InfiniteScrollObserver from '@/components/utils/infinite-scroll-observer';
import { useAuctions } from '@/queries/use-auctions';
import { useAuctionsHistoryDrawer } from '.';
import ResultCard from './result-card';

export default function Result() {
  const { activeTab } = useAuctionsHistoryDrawer();
  const {
    data: auctions,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage
  } = useAuctions({
    resource: 'participant',
    participationType: activeTab === 'all' ? undefined : activeTab,
    status: activeTab === 'invited' ? 'pending' : undefined
  });
  return (
    <section className="flex flex-col space-y-6">
      {!isLoading && auctions?.length === 0 && (
        <p className="px-2 text-sm font-medium text-error">No Results Found.</p>
      )}

      {isLoading &&
        new Array(6).fill('nothing').map((_, i) => (
          <div key={i} className="flex min-h-36 md:space-x-6">
            <Skeleton className="hidden aspect-video h-44 md:block" />

            <Skeleton className="h-40 w-full flex-1 md:hidden" />

            <div className="hidden flex-grow flex-col space-y-2 md:flex">
              <Skeleton className="h-11" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          </div>
        ))}

      {auctions?.map((auction) => <ResultCard key={auction.id} auction={auction} />)}
      <InfiniteScrollObserver
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        className="mt-2"
      />
    </section>
  );
}
