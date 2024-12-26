import { apiClient } from '@/lib/api-client';
import { concatenateSearchParams } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

export type KeyOptions = {
  sort?: 'asc' | 'desc';
  rating?: number;
  from?: string;
  to?: string;
  limit?: number;
};

export const feedbacksKey = (options: KeyOptions | undefined) => [
  'feedbacks',
  {
    ...options,
    sort: options?.sort || 'desc'
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
    select: (data) => data.pages.map((page) => page.feedbacks).flat(1)
  });
};

type Result = { cursor: string | undefined; feedbacks: Feedback[] };
type Options = {
  signal: AbortSignal;
  cursor: string | undefined;
} & KeyOptions;
export const fetchFeedbacks = async ({ signal, ...query }: Options): Promise<Result> => {
  const res = await apiClient.get<Result>(concatenateSearchParams('/api/feedbacks', query), {
    signal,
    withCredentials: true
  });
  return res.data;
};
