import { backendUrl } from '@/lib/constants';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const userKey = (userId: string) => ['user', userId];

export const useUser = (userId: string, queryOptions?: Partial<UseQueryOptions<User>>) => {
  return useQuery({
    queryKey: userKey(userId),
    queryFn: ({ signal }) => fetchUser({ userId, signal }),
    ...queryOptions
  });
};

type Options = { userId: string; signal: AbortSignal };
export const fetchUser = async ({ userId, signal }: Options): Promise<User> => {
  const res = await axios.get<{ user: User }>(`${backendUrl}/api/users/${userId}`, {
    signal
  });
  return res.data.user;
};
