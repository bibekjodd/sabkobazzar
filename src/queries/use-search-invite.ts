import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useSearchInvite = ({ auctionId, q }: { auctionId: string; q: string }) => {
  return useInfiniteQuery({
    queryKey: ['search-invite', { auctionId, q }],
    queryFn: ({ pageParam, signal }) => searchInvite({ auctionId, q, page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam(lastPage, _, lastPageParam) {
      if (lastPage.length) return lastPageParam + 1;
      return undefined;
    },
    gcTime: 30 * 1000,
    maxPages: 3
  });
};

type Result = User & { isInvited: boolean };
type Options = { signal: AbortSignal; q: string; auctionId: string; page: number | undefined };
const searchInvite = async ({ signal, q, auctionId, page }: Options): Promise<Result[]> => {
  try {
    const url = new URL(`${backendUrl}/api/auctions/${auctionId}/search-invite`);
    url.searchParams.set('q', q);
    page && url.searchParams.set('page', page.toString());
    const res = await axios.get<{ users: Result[] }>(url.href, {
      withCredentials: true,
      signal
    });
    return res.data.users;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
