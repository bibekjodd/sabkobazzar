import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const profileKey = ['profile'];
export const useProfile = () => {
  return useQuery({
    queryKey: profileKey,
    queryFn: ({ signal }) => fetchProfile({ signal }),
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000
  });
};

export const fetchProfile = async ({ signal }: { signal: AbortSignal }): Promise<UserProfile> => {
  try {
    const url = `${backendUrl}/api/users/profile`;
    const { data } = await axios.get(url, { withCredentials: true, signal });
    return data.user;
  } catch (error) {
    if (error instanceof AxiosError && error.status === 401) {
      const queryClient = getQueryClient();
      queryClient.setQueryData(['profile'], null);
    }
    throw new Error(extractErrorMessage(error));
  }
};
