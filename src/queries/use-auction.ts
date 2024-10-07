import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { QueryOptions, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useAuction = (auctionId: string, queryOptions?: QueryOptions<Auction>) => {
  return useQuery<Auction>({
    queryKey: ['auction', auctionId],
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
      signal
    });
    return res.data.auction;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
