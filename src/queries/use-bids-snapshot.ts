import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

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
  const res = await apiClient.get<{ bids: Bid[] }>(`/api/auctions/${auctionId}/bids-snapshot`, {
    signal
  });
  return res.data.bids;
};
