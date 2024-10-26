import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const bidsSnapshotKey = (auctionId: string) => ['bids-snapshot', auctionId];
export const useBidsSnapshot = (auctionId: string) => {
  return useQuery({
    queryKey: bidsSnapshotKey(auctionId),
    queryFn: ({ signal }) => fetchBidsSnapshot({ auctionId, signal }),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true
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
    const res = await axios.get<{ bids: Bid[] }>(
      `${backendUrl}/api/auctions/${auctionId}/bids-snapshot`,
      {
        signal
      }
    );
    return res.data.bids;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
