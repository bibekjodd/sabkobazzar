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
  const profile = queryClient.getQueryData<UserProfile>(profileKey);

  const accessorKey = auctionsStatsKey({
    user: profile?.role === 'admin' ? undefined : profile?.id
  });

  if (
    !queryClient.getQueryData(accessorKey) &&
    !queryClient.isFetching({ queryKey: accessorKey })
  ) {
    queryClient.prefetchQuery({
      queryKey: accessorKey,
      queryFn: fetchAuctionsStats
    });
  }
};

export const prefetchDashboardAuctions = () => {
  const queryClient = getQueryClient();
  const profile = queryClient.getQueryData<UserProfile>(profileKey);
  if (!profile) return;

  const accessorKey = auctionsKey({
    resource: profile.role === 'user' ? 'self' : undefined
  });

  if (queryClient.getQueryData(accessorKey) || queryClient.isFetching({ queryKey: accessorKey }))
    return;
  queryClient.prefetchInfiniteQuery({
    queryKey: accessorKey,
    queryFn: ({ signal }) => fetchAuctions({ signal, cursor: undefined, owner: profile.id }),
    initialPageParam: undefined
  });
};
