import { backendUrl } from '@/lib/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export type KeyOptions = {
  sort?: 'asc' | 'desc';
  rating?: number | 'all';
  from?: string;
  to?: string;
  limit?: number;
};

export const feedbacksKey = (options: KeyOptions | undefined) => [
  'feedbacks',
  {
    sort: options?.sort || 'desc',
    rating: options?.rating || 'all',
    from: options?.from,
    to: options?.to,
    limit: options?.limit
  }
];

export const useFeedbacks = (keyOptions?: KeyOptions) => {
  return useInfiniteQuery({
    queryKey: feedbacksKey(keyOptions),
    queryFn: ({ signal, pageParam }) =>
      fetchFeedbacks({ signal, cursor: pageParam, ...keyOptions }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam(lastPage) {
      return lastPage.cursor;
    },
    maxPages: 10,
    select: (data) => data.pages.map((page) => page.feedbacks).flat(1)
  });
};

type Result = { cursor: string | undefined; feedbacks: Feedback[] };
type Options = {
  signal: AbortSignal;
  cursor: string | undefined;
} & KeyOptions;
export const fetchFeedbacks = async ({ signal, ...query }: Options): Promise<Result> => {
  const url = new URL(`${backendUrl}/api/feedbacks`);

  if (query.rating === 'all') query.rating = undefined;
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  const res = await axios.get<Result>(url.href, { signal, withCredentials: true });
  return res.data;
};
