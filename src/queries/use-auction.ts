import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useAuction = (auctionId: string) => {
  return useQuery({
    queryKey: ['auction', auctionId],
    queryFn: ({ signal }) => fetchAuction({ auctionId, signal })
  });
};

const fetchAuction = async ({ auctionId, signal }: { auctionId: string; signal: AbortSignal }) => {
  try {
    const res = await axios.get<{ auction: Auction }>(`${backendUrl}/api/auctions/${auctionId}`, {
      signal
    });
    return res.data.auction;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
