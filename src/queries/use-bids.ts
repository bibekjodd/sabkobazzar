import { apiClient } from '@/lib/api-client';
import { concatenateSearchParams } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

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
const fetchBids = async ({ signal, auctionId, ...query }: Options): Promise<FetchBidsResult> => {
  const res = await apiClient.get<FetchBidsResult>(
    concatenateSearchParams(`/api/auctions/${auctionId}/bids`, query),
    {
      withCredentials: true,
      signal
    }
  );
  return res.data;
};
