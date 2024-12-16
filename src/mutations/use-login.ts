import { backendUrl } from '@/lib/constants';
import { LoginSchema } from '@/lib/form-schemas';
import { getQueryClient } from '@/lib/query-client';
import { extractErrorMessage } from '@/lib/utils';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useLogin = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: LoginSchema) => {
      const res = await axios.post<{ user: UserProfile }>(`${backendUrl}/api/auth/login`, data, {
        withCredentials: true
      });
      return res.data.user;
    },

    onError(err) {
      toast.error(`Could not login! ${extractErrorMessage(err)}`);
    },
    onSuccess(data) {
      toast.success('Logged in successfully');
      queryClient.setQueryData<UserProfile>(profileKey, data);
    }
  });
};
