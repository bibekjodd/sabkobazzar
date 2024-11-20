import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

type KeyOptions = {
  ownerId: string | null;
  productId: string | null;
  sort: 'asc' | 'desc' | undefined;
};
export const auctionsKey = (options: KeyOptions) => ['auctions', options];
export const useAuctions = (options: KeyOptions) => {
  return useInfiniteQuery({
    queryKey: auctionsKey(options),
    queryFn: ({ pageParam, signal }) => fetchUpcomingAuctions({ pageParam, signal, ...options }),

    initialPageParam: undefined as PageParam | undefined,
    getNextPageParam(lastPage) {
      const lastResult = lastPage.at(lastPage.length - 1);
      if (!lastResult) return undefined;

      return {
        cursor: lastResult.startsAt,
        cursorId: lastResult.id
      };
    }
  });
};

type PageParam = { cursor: string; cursorId: string | undefined };
type Options = KeyOptions & {
  pageParam: PageParam | undefined;
  signal: AbortSignal;
};
const fetchUpcomingAuctions = async ({
  pageParam,
  ownerId,
  signal,
  productId,
  sort
}: Options): Promise<Auction[]> => {
  try {
    const url = new URL(`${backendUrl}/api/auctions`);
    if (pageParam?.cursor) url.searchParams.set('cursor', pageParam?.cursor);
    if (pageParam?.cursorId) url.searchParams.set('cursorId', pageParam?.cursorId);
    if (productId) url.searchParams.set('product', productId);
    if (ownerId) url.searchParams.set('owner', ownerId);
    if (sort) url.searchParams.set('sort', sort);

    const { data } = await axios.get<{ auctions: Auction[] }>(url.href, {
      signal,
      withCredentials: true
    });
    return data.auctions;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
