import { backendUrl } from '@/lib/constants';
import { getQueryClient } from '@/lib/query-client';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useLoginWithOtp = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: ['login-with-otp'],
    mutationFn: async (data: { otp: string; email: string }) => {
      const res = await axios.post<{ user: UserProfile }>(
        `${backendUrl}/api/auth/otp/verify`,
        data,
        {
          withCredentials: true
        }
      );
      return res.data.user;
    },
    onSuccess(data) {
      toast.success('Logged in successfully');
      queryClient.setQueryData<UserProfile>(profileKey, data);
    }
  });
};
