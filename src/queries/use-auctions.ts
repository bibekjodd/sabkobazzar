import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export type KeyOptions = Partial<{
  title: string;
  owner: string;
  product: string;
  limit: number;
  sort: 'title_asc' | 'title_desc' | 'starts_at_asc' | 'starts_at_desc' | 'bid_asc' | 'bid_desc';
  condition: Auction['condition'] | 'all';
  status: 'pending' | 'live' | 'completed' | 'cancelled' | 'all';
  from: string;
  to: string;
  inviteOnly: boolean;
  unbidded: boolean;
}>;
export const auctionsKey = (options?: KeyOptions) => [
  'auctions',
  {
    title: options?.title,
    owner: options?.owner,
    product: options?.product,
    limit: options?.limit,
    sort: options?.sort,
    condition: options?.condition === 'all' ? undefined : options?.condition,
    status: options?.status === 'all' ? undefined : options?.status,
    from: options?.from,
    to: options?.to,
    inviteOnly: options?.inviteOnly,
    unbidded: options?.unbidded
  }
];

export const useAuctions = (options?: KeyOptions) => {
  return useInfiniteQuery({
    queryKey: auctionsKey(options),
    queryFn: ({ pageParam, signal }) => fetchAuctions({ cursor: pageParam, signal, ...options }),

    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.cursor
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
  try {
    const url = new URL(`${backendUrl}/api/auctions`);

    for (const [key, value] of Object.entries(query)) {
      if (value) url.searchParams.set(key, String(value));
    }

    const { data } = await axios.get<FetchAuctionsResult>(url.href, {
      signal,
      withCredentials: true
    });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
