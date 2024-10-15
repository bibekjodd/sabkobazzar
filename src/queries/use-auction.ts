import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const auctionKey = (id: string) => ['auction', id];
export const useAuction = (auctionId: string, queryOptions?: Partial<UseQueryOptions<Auction>>) => {
  return useQuery<Auction>({
    queryKey: auctionKey(auctionId),
    queryFn: ({ signal }) => fetchAuction({ auctionId, signal }),
    ...queryOptions
  });
};

const fetchAuction = async ({
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
