import { backendUrl } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const logoutKey = ['logout'];

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: logoutKey,
    mutationFn: logout,
    onSuccess() {
      queryClient.setQueryData(['profile'], null);
      queryClient.clear();
    }
  });
};

const logout = async () => {
  try {
    return await axios.post(`${backendUrl}/api/auth/logout`, undefined, { withCredentials: true });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
