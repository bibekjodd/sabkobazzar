import { apiClient } from '@/lib/api-client';
import { concatenateSearchParams } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

export type KeyOptions = Partial<{
  sort: 'asc' | 'desc';
  from: string;
  to: string;
  limit: number;
  user: string;
  auction: string;
  responded: boolean;
}>;

export const reportsKey = (options: KeyOptions) => [
  'reports',
  {
    ...options,
    sort: options.sort || 'desc'
  } satisfies KeyOptions
];

export const useReports = (options: KeyOptions) => {
  return useInfiniteQuery({
    queryKey: reportsKey(options),
    queryFn: ({ signal, pageParam }) => fetchReports({ ...options, cursor: pageParam, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam(lastPage) {
      return lastPage.cursor;
    },
    select: (data) => data.pages.map((page) => page.reports).flat(1)
  });
};

type Options = KeyOptions & {
  cursor: string | undefined;
  signal: AbortSignal;
};
type Result = {
  reports: DashboardReport[];
  cursor: string | undefined;
};
export const fetchReports = async ({ signal, ...query }: Options): Promise<Result> => {
  const res = await apiClient.get<Result>(concatenateSearchParams('/api/reports', query), {
    withCredentials: true,
    signal
  });
  return res.data;
};
