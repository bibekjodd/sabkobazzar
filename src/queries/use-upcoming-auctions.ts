import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useUpcomingAuctions = ({
  ownerId,
  productId
}: {
  ownerId: string | null;
  productId: string | null;
}) => {
  return useInfiniteQuery({
    queryKey: ['upcoming-auctions', { ownerId, productId }],
    queryFn: ({ pageParam, signal }) =>
      fetchUpcomingAuctions({ cursor: pageParam, ownerId, productId, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam(lastPage) {
      return lastPage.at(0)?.startsAt;
    }
  });
};

type Options = {
  cursor: string | undefined;
  ownerId: string | null;
  productId: string | null;
  signal: AbortSignal;
};
const fetchUpcomingAuctions = async ({
  cursor,
  ownerId,
  signal,
  productId
}: Options): Promise<Auction[]> => {
  try {
    const url = new URL(`${backendUrl}/api/auctions/upcoming`);
    cursor && url.searchParams.set('cursor', cursor);
    productId && url.searchParams.set('product', productId);
    ownerId && url.searchParams.set('owner', ownerId);
    const { data } = await axios.get<{ auctions: Auction[] }>(url.href, { signal });
    return data.auctions;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
