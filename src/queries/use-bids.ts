import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useBids = (auctionId: string) => {
  return useInfiniteQuery({
    queryKey: ['bids', auctionId],
    queryFn: ({ signal, pageParam }) => fetchBids({ auctionId, cursor: pageParam, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam(lastPage) {
      return lastPage.at(lastPage.length - 1)?.at;
    }
  });
};

const fetchBids = async ({
  signal,
  auctionId,
  cursor
}: {
  signal: AbortSignal;
  auctionId: string;
  cursor: string | undefined;
}): Promise<Bid[]> => {
  try {
    const url = new URL(`${backendUrl}/api/auctions/${auctionId}/bids`);
    cursor && url.searchParams.set('cursor', cursor);
    const res = await axios.get<{ bids: Bid[] }>(url.href, {
      withCredentials: true,
      signal
    });
    return res.data.bids;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
