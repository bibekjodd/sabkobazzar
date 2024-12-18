import { backendUrl } from '@/lib/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export type KeyOptions = Partial<{
  sort: 'asc' | 'desc';
  from: string;
  to: string;
  limit: number;
  user: string;
  auction: string;
  responded: 'true' | 'false' | 'all';
}>;

export const reportsKey = (options: KeyOptions) => [
  'reports',
  {
    sort: options.sort || 'desc',
    from: options.from,
    to: options.to,
    limit: options.limit,
    user: options.user,
    auction: options.auction,
    responded: options.responded || 'all'
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
    select: (data) => data.pages.map((page) => page.reports).flat(1),
    maxPages: 10
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
  const url = new URL(`${backendUrl}/api/reports`);

  for (const [key, value] of Object.entries(query)) {
    if (value) url.searchParams.set(key, String(value));
  }
  const res = await axios.get<Result>(url.href, { withCredentials: true, signal });
  return res.data;
};
