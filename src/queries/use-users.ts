import { apiClient } from '@/lib/api-client';
import { concatenateSearchParams } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

type KeyOptions = Partial<{
  q: string;
  email: string;
  limit: number;
  page: number;
  role: User['role'];
}>;
export const usersKey = (options: KeyOptions) => [
  'users',
  {
    ...options,
    q: options.q?.trim() || undefined
  }
];

export const useUsers = (options: KeyOptions) => {
  return useInfiniteQuery({
    queryKey: usersKey(options),
    queryFn: ({ signal, pageParam }) => fetchUsers({ signal, page: pageParam, ...options }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam(lastPage, allPages, lastPageParam) {
      const limit = options.limit || 20;
      if (lastPage.length < limit || !lastPageParam) return undefined;
      return lastPageParam + 1;
    },
    select: (data) => data.pages.flat(1)
  });
};

type Options = KeyOptions & {
  signal: AbortSignal;
  page: number | undefined;
};
export const fetchUsers = async ({ signal, ...query }: Options): Promise<User[]> => {
  const res = await apiClient.get<{ users: User[] }>(concatenateSearchParams('/api/users', query), {
    signal
  });
  return res.data.users;
};
