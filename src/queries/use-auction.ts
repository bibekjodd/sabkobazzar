import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { isAuctionCompleted } from '@/lib/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const auctionKey = (id: string) => ['auction', id];
export const useAuction = (
  auctionId: string,
  queryOptions?: Partial<UseQueryOptions<Auction | null>>
) => {
  const query = useQuery<Auction | null>({
    queryKey: auctionKey(auctionId),
    queryFn: ({ signal }) => fetchAuction({ auctionId, signal }),
    throwOnError(_, query) {
      query.setData(null);
      return false;
    },
    ...queryOptions
  });

  // refetch if the auction winner is not calculated
  useEffect(() => {
    const isCompleted = query.data && isAuctionCompleted(query.data);
    if (
      isCompleted &&
      query.data?.status !== 'cancelled' &&
      query.data?.status !== 'unbidded' &&
      !query.data?.winner &&
      !query.isFetching
    ) {
      getQueryClient().invalidateQueries({ queryKey: auctionKey(auctionId) });
    }
  }, [query.data, auctionId, query.isFetching]);

  return query;
};

export const fetchAuction = async ({
  auctionId,
  signal
}: {
  auctionId: string;
  signal: AbortSignal;
}): Promise<Auction> => {
  const res = await apiClient.get<{ auction: Auction }>(`/api/auctions/${auctionId}`, {
    signal,
    withCredentials: true
  });
  return res.data.auction;
};
