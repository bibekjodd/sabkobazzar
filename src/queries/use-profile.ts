import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const useProfile = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['profile'],
    queryFn: ({ signal }) => fetchProfile({ signal, queryClient }),
    refetchOnWindowFocus: true
  });
};

export const fetchProfile = async ({
  signal,
  queryClient
}: {
  signal: AbortSignal;
  queryClient: QueryClient;
}): Promise<UserProfile> => {
  try {
    const url = `${backendUrl}/api/users/profile`;
    const { data } = await axios.get(url, { withCredentials: true, signal });
    return data.user;
  } catch (error) {
    if (error instanceof AxiosError && error.status === 401) {
      queryClient.setQueryData(['profile'], null);
    }
    throw new Error(extractErrorMessage(error));
  }
};
