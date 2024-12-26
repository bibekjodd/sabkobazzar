import { closeAuthDialog } from '@/components/dialogs/auth-dialog';
import { closeLoginWithOtpDialog } from '@/components/dialogs/login-with-otp-dialog';
import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLoginWithOtp = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: ['login-with-otp'],
    mutationFn: async (data: { otp: string; email: string }) => {
      const res = await apiClient.post<{ user: UserProfile }>('/api/auth/otp/verify', data, {
        withCredentials: true
      });
      return res.data.user;
    },
    onSuccess(data) {
      closeLoginWithOtpDialog();
      closeAuthDialog();
      toast.success('Logged in successfully');
      queryClient.setQueryData<UserProfile>(profileKey, data);
    }
  });
};
