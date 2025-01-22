import { apiClient } from '@/lib/api-client';
import { concatenateSearchParams } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

export type KeyOptions = Partial<{
  title: string;
  owner: string;
  limit: number;
  category: 'arts' | 'realestate' | 'electronics' | 'others';
  sort: 'title_asc' | 'title_desc' | 'starts_at_asc' | 'starts_at_desc' | 'bid_asc' | 'bid_desc';
  condition: Auction['condition'];
  status: 'pending' | 'live' | 'completed' | 'cancelled';
  from: string;
  to: string;
  inviteOnly: boolean;
  unbidded: boolean;
  resource: 'host' | 'participant';
  participationType: 'joined' | 'invited' | 'kicked' | 'rejected';
}>;
export const auctionsKey = (options?: KeyOptions) => [
  'auctions',
  {
    ...options,
    sort: options?.sort || 'starts_at_desc',
    title: options?.title?.trim()
  }
];

export const useAuctions = (options?: KeyOptions) => {
  return useInfiniteQuery({
    queryKey: auctionsKey(options),
    queryFn: ({ pageParam, signal }) => fetchAuctions({ cursor: pageParam, signal, ...options }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
    select: (data) => data.pages.map((page) => page.auctions).flat(1)
  });
};

type Options = KeyOptions & {
  cursor: string | undefined;
  signal: AbortSignal;
};

export type FetchAuctionsResult = { cursor: string | undefined; auctions: Auction[] };
export const fetchAuctions = async ({
  signal,
  ...query
}: Options): Promise<FetchAuctionsResult> => {
  const { data } = await apiClient.get<FetchAuctionsResult>(
    concatenateSearchParams('/api/auctions', query),
    {
      signal,
      withCredentials: true
    }
  );
  return data;
};
