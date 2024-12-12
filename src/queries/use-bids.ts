import { backendUrl } from '@/lib/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

type KeyOptions = { auctionId: string } & Partial<{
  sort: 'asc' | 'desc';
  limit: number;
}>;
export const bidsKey = (options: KeyOptions) => [
  'bids',
  {
    auctionId: options.auctionId,
    limit: options.limit,
    sort: options.sort || 'desc'
  } satisfies KeyOptions
];

export const useBids = (options: KeyOptions) => {
  return useInfiniteQuery({
    queryKey: bidsKey(options),
    queryFn: ({ signal, pageParam }) => fetchBids({ ...options, cursor: pageParam, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam(lastPage) {
      return lastPage.cursor;
    },
    select: (data) => data.pages.map((page) => page.bids).flat(1)
  });
};

export type FetchBidsResult = { cursor: string | undefined; bids: Bid[] };
type Options = KeyOptions & { cursor: string | undefined; signal: AbortSignal };
const fetchBids = async ({
  signal,
  auctionId,
  cursor,
  limit,
  sort
}: Options): Promise<FetchBidsResult> => {
  const url = new URL(`${backendUrl}/api/auctions/${auctionId}/bids`);
  if (cursor) url.searchParams.set('cursor', cursor);
  if (sort) url.searchParams.set('sort', sort);
  if (limit) url.searchParams.set('limit', limit.toString());
  const res = await axios.get<FetchBidsResult>(url.href, {
    withCredentials: true,
    signal
  });
  return res.data;
};
