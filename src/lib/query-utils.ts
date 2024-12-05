import { auctionKey, fetchAuction } from '@/queries/use-auction';
import { auctionsKey, fetchAuctions } from '@/queries/use-auctions';
import { auctionsStatsKey, fetchAuctionsStats } from '@/queries/use-auctions-stats';
import { profileKey } from '@/queries/use-profile';
import { getQueryClient } from './query-client';

export const prefetchAuction = (auction: Auction | string) => {
  const queryClient = getQueryClient();
  if (typeof auction !== 'string') {
    queryClient.setQueryData<Auction>(auctionKey(auction.id), { ...auction });
    return;
  }

  if (
    queryClient.getQueryData(auctionKey(auction)) ||
    queryClient.isFetching({ queryKey: auctionKey(auction) })
  )
    return;
  queryClient.prefetchQuery({
    queryKey: auctionKey(auction),
    queryFn: ({ signal }) => fetchAuction({ auctionId: auction, signal })
  });
};

export const prefetchDashboardData = () => {
  const queryClient = getQueryClient();
  if (
    !queryClient.getQueryData(auctionsStatsKey) &&
    !queryClient.isFetching({ queryKey: auctionsStatsKey })
  ) {
    queryClient.prefetchQuery({ queryKey: auctionsStatsKey, queryFn: fetchAuctionsStats });
  }
};

export const prefetchDashboardAuctions = () => {
  const queryClient = getQueryClient();
  const profile = queryClient.getQueryData<UserProfile>(profileKey);
  if (!profile) return;

  if (
    queryClient.getQueryData(auctionsKey({ owner: profile.id })) ||
    queryClient.isFetching({ queryKey: auctionsKey({ owner: profile.id }) })
  )
    return;
  queryClient.prefetchInfiniteQuery({
    queryKey: auctionsKey({ owner: profile.id }),
    queryFn: ({ signal }) => fetchAuctions({ signal, cursor: undefined, owner: profile.id }),
    initialPageParam: undefined
  });
};
