import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
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
    if (
      query.data?.isFinished &&
      !query.data?.isCancelled &&
      !query.data?.winner &&
      !query.data?.isUnbidded &&
      !query.isFetching
    ) {
      getQueryClient().fetchQuery({
        queryKey: auctionKey(auctionId),
        queryFn: ({ signal }) => fetchAuction({ signal, auctionId })
      });
    }
  }, [
    query.data?.isFinished,
    query.data?.isCancelled,
    query.data?.isUnbidded,
    query.data?.winner,
    auctionId,
    query.isFetching
  ]);

  return query;
};

export const fetchAuction = async ({
  auctionId,
  signal
}: {
  auctionId: string;
  signal: AbortSignal;
}): Promise<Auction> => {
  try {
    const res = await axios.get<{ auction: Auction }>(`${backendUrl}/api/auctions/${auctionId}`, {
      signal,
      withCredentials: true
    });
    return res.data.auction;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
