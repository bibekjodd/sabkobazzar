import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useAuctions = ({
  ownerId,
  productId,
  order
}: {
  ownerId: string | null;
  productId: string | null;
  order: 'asc' | 'desc';
}) => {
  return useInfiniteQuery({
    queryKey: ['auctions', { ownerId, productId, order }],
    queryFn: ({ pageParam, signal }) =>
      fetchUpcomingAuctions({ cursor: pageParam, ownerId, productId, signal, order }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam(lastPage) {
      return lastPage.at(lastPage.length - 1)?.startsAt;
    }
  });
};

type Options = {
  cursor: string | undefined;
  ownerId: string | null;
  productId: string | null;
  signal: AbortSignal;
  order: 'asc' | 'desc';
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
    cursor && url.searchParams.set('cursor', cursor);
    productId && url.searchParams.set('product', productId);
    ownerId && url.searchParams.set('owner', ownerId);
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
