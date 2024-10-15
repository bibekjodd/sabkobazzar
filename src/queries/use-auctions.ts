import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

type KeyOptions = {
  ownerId: string | null;
  productId: string | null;
  order: string;
};
export const auctionsKey = (options: KeyOptions) => ['auctions', options];
export const useAuctions = (options: KeyOptions) => {
  return useInfiniteQuery({
    queryKey: auctionsKey(options),
    queryFn: ({ pageParam, signal }) =>
      fetchUpcomingAuctions({ cursor: pageParam, signal, ...options }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam(lastPage) {
      return lastPage.at(lastPage.length - 1)?.startsAt;
    }
  });
};

type Options = KeyOptions & {
  cursor: string | undefined;
  signal: AbortSignal;
};
const fetchUpcomingAuctions = async ({
  cursor,
  ownerId,
  signal,
  productId,
  order
}: Options): Promise<Auction[]> => {
  try {
    const url = new URL(`${backendUrl}/api/auctions`);
    if (cursor) url.searchParams.set('cursor', cursor);
    if (productId) url.searchParams.set('product', productId);
    if (ownerId) url.searchParams.set('owner', ownerId);
    url.searchParams.set('order', order);
    const { data } = await axios.get<{ auctions: Auction[] }>(url.href, {
      signal,
      withCredentials: true
    });
    return data.auctions;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
