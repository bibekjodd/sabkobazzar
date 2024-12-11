import { backendUrl, MILLIS } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { isShallowEqual } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const profileKey = ['profile'];
export const useProfile = () => {
  return useQuery<UserProfile | null>({
    queryKey: profileKey,
    queryFn: fetchProfile,
    refetchOnWindowFocus: true,
    refetchInterval: MILLIS.MINUTE,
    throwOnError(err, query) {
      query.setData(null);
      return false;
    }
  });
};

export const fetchProfile = async ({ signal }: { signal: AbortSignal }): Promise<UserProfile> => {
  const url = `${backendUrl}/api/users/profile`;
  const { data } = await axios.get<{ user: UserProfile }>(url, { withCredentials: true, signal });

  const queryClient = getQueryClient();
  const oldProfileData = queryClient.getQueryData<UserProfile>(profileKey);
  if (!oldProfileData) return data.user;

  const isSame = isShallowEqual(
    { ...oldProfileData, lastOnline: undefined },
    { ...data.user, lastOnline: undefined }
  );
  if (isSame) return oldProfileData;

  return data.user;
};
