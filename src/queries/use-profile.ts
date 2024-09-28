import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: ({ signal }) => fetchProfile({ signal }),
    refetchOnWindowFocus: true
  });
};

export const fetchProfile = async ({ signal }: { signal: AbortSignal }): Promise<User> => {
  try {
    const url = `${backendUrl}/api/users/profile`;
    const { data } = await axios.get(url, { withCredentials: true, signal });
    return data.user;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
