import { closeVerifyAccountDialog } from '@/components/dialogs/verify-account-dialog';
import { apiClient } from '@/lib/api-client';
import { getQueryClient } from '@/lib/query-client';
import { profileKey } from '@/queries/use-profile';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useVerifyAccount = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: ['verify-account'],
    mutationFn: async ({ otp }: { otp: string }) => {
      await apiClient.post('/api/users/otp/verify', { otp }, { withCredentials: true });
    },

    onError() {
      queryClient.invalidateQueries({ queryKey: profileKey });
    },

    onSuccess() {
      closeVerifyAccountDialog();
      toast.success('Account verified successfully');
      const profileData = queryClient.getQueryData<UserProfile>(profileKey);
      if (!profileData) return;
      queryClient.setQueryData<UserProfile>(profileKey, { ...profileData, isVerified: true });
    }
  });
};
