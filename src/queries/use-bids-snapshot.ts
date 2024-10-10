import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useBidsSnapshot = (auctionId: string) => {
  return useQuery({
    queryKey: ['bids-snapshot', auctionId],
    queryFn: ({ signal }) => fetchBidsSnapshot({ auctionId, signal })
  });
};

const fetchBidsSnapshot = async ({
  auctionId,
  signal
}: {
  auctionId: string;
  signal: AbortSignal;
}): Promise<Bid[]> => {
  try {
    const res = await axios.get<{ bids: Bid[] }>(`${backendUrl}/api/bids/${auctionId}/snapshot`, {
      signal
    });
    return res.data.bids;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
