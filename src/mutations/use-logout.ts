import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const logoutKey = ['logout'];

export const useLogout = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: logoutKey,
    mutationFn: logout,
    onSuccess() {
      queryClient.setQueryData(profileKey, null);
      queryClient.clear();
    },
    retry: 1
  });
};

const logout = async () => {
  return await axios.post(`${backendUrl}/api/auth/logout`, undefined, { withCredentials: true });
};
