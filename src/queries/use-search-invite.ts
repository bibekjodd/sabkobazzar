import { apiClient } from '@/lib/api-client';
import { MILLIS } from '@/lib/constants';
import { concatenateSearchParams } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

type KeyOptions = { auctionId: string; q: string };
export const searchInviteKey = (options: KeyOptions) => [
  'search-invite',
  { ...options, q: options.q.trim() || undefined }
];

export const useSearchInvite = ({ auctionId, q }: KeyOptions) => {
  return useInfiniteQuery({
    queryKey: searchInviteKey({ auctionId, q }),
    queryFn: ({ pageParam, signal }) => searchInvite({ auctionId, q, page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam(lastPage, _, lastPageParam) {
      if (lastPage.length) return lastPageParam + 1;
      return undefined;
    },
    gcTime: MILLIS.MINUTE / 2
  });
};

type Result = User & { status: ParticipationStatus };
type Options = { signal: AbortSignal; q: string; auctionId: string; page: number | undefined };
const searchInvite = async ({ signal, auctionId, ...query }: Options): Promise<Result[]> => {
  const res = await apiClient.get<{ users: Result[] }>(
    concatenateSearchParams(`/api/auctions/${auctionId}/search-invite`, query),
    {
      withCredentials: true,
      signal
    }
  );
  return res.data.users;
};
